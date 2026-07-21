from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import GoogleLoginRequest, TokenResponse, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/google", response_model=TokenResponse)
def login_with_google(
    payload: GoogleLoginRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    google_payload = auth_service.verify_google_token(payload.id_token)

    user = auth_service.get_or_create_user(
        db,
        google_id=google_payload["sub"],
        email=google_payload["email"],
        name=google_payload.get("name", ""),
    )

    access_token = auth_service.create_access_token(user.id)

    return TokenResponse(access_token=access_token, user=UserResponse.model_validate(user))
