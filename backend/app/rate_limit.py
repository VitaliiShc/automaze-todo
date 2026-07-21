import threading
import time
from collections import defaultdict
from collections.abc import Callable

from fastapi import Depends, HTTPException, Request, status

from app.models.user import User
from app.services.auth_service import get_current_user

# In-memory hit tracker: key -> list of monotonic timestamps within the current window.
# Deliberately simple (no Redis/external store) — adequate for a single-instance
# deployment at this project's scale. State resets on restart/redeploy, which is an
# accepted trade-off, not a bug.
_hits: dict[str, list[float]] = defaultdict(list)

# FastAPI runs sync route handlers in a thread pool, so this dict is genuinely
# accessed from multiple threads at once — the lock guards every read/write below.
_lock = threading.Lock()

# Per-key timestamp lists are already pruned on every access, so a key being
# actively rate-limited never grows unbounded. The one thing that DOES grow
# without bound is the number of distinct keys (e.g. one-off IPs) sitting in
# _hits forever once they stop being probed. This sweep clears those out
# occasionally instead of on every call, to keep the cost negligible.
_STALE_AFTER_SECONDS = 3600.0
_SWEEP_EVERY_N_CALLS = 200
_calls_since_sweep = 0


def _sweep_stale_keys(now: float) -> None:
    stale_keys = [
        key
        for key, timestamps in _hits.items()
        if not timestamps or timestamps[-1] < now - _STALE_AFTER_SECONDS
    ]
    for key in stale_keys:
        del _hits[key]


def _check_rate_limit(key: str, max_requests: int, window_seconds: float) -> None:
    global _calls_since_sweep
    now = time.monotonic()

    with _lock:
        timestamps = _hits[key]
        cutoff = now - window_seconds

        while timestamps and timestamps[0] < cutoff:
            timestamps.pop(0)

        if len(timestamps) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
            )

        timestamps.append(now)

        _calls_since_sweep += 1
        if _calls_since_sweep >= _SWEEP_EVERY_N_CALLS:
            _calls_since_sweep = 0
            _sweep_stale_keys(now)


def rate_limit_by_ip(max_requests: int, window_seconds: float) -> Callable[[Request], None]:
    """Rate limit keyed by client IP — for endpoints with no authenticated user yet."""

    def dependency(request: Request) -> None:
        client_host = request.client.host if request.client else "unknown"
        _check_rate_limit(f"ip:{client_host}", max_requests, window_seconds)

    return dependency


def rate_limit_by_user(max_requests: int, window_seconds: float) -> Callable[[User], None]:
    """Rate limit keyed by authenticated user id.

    Depends on get_current_user itself so it always limits the real caller, not a
    spoofable client-supplied value. FastAPI caches dependency results per request,
    so this does not re-run JWT decoding/DB lookup beyond what the route already does.
    """

    def dependency(current_user: User = Depends(get_current_user)) -> None:
        _check_rate_limit(f"user:{current_user.id}", max_requests, window_seconds)

    return dependency
