from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        truncated_password = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(truncated_password, hashed_password.encode("utf-8"))
    except ValueError:
        return False


def get_password_hash(password: str) -> str:
    # bcrypt limita la longitud a 72 bytes, por eso truncamos de forma segura.
    truncated_password = password.encode("utf-8")[:72]
    return bcrypt.hashpw(truncated_password, bcrypt.gensalt()).decode("utf-8")


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expires_in = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    expire_at = datetime.now(timezone.utc) + expires_in
    payload = {"sub": subject, "exp": expire_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
