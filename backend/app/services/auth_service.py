from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport.requests import Request as GoogleAuthRequest
from google.oauth2 import id_token as google_id_token
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database.session import get_db
from app.models.user import User

_JWT_ALGORITHM = "HS256"
_bearer_scheme = HTTPBearer()


def verify_google_token(token: str) -> dict[str, Any]:
    """Verify a Google ID token's signature, audience, issuer and expiry.

    google.oauth2.id_token.verify_oauth2_token performs all of this internally
    (audience via the given parameter, expiry as part of standard JWT
    verification, issuer against Google's own allowlist) — there is nothing
    left to re-check by hand.
    """
    try:
        payload: dict[str, Any] = google_id_token.verify_oauth2_token(  # type: ignore[no-untyped-call]
            token, GoogleAuthRequest(), settings.google_client_id
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token.",
        ) from exc

    return payload


def get_or_create_user(db: Session, google_id: str, email: str, name: str) -> User:
    """Look up a user by google_id only — email is never used for matching."""
    user = db.execute(select(User).where(User.google_id == google_id)).scalar_one_or_none()
    if user is not None:
        return user

    user = User(google_id=google_id, email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.jwt_expires_minutes)
    payload = {"sub": str(user_id), "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm=_JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[_JWT_ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        ) from exc

    return int(payload["sub"])


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    user_id = decode_access_token(credentials.credentials)

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")

    return user
