from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import hashlib
import hmac
import os
import base64

security = HTTPBearer()

# En producción: usar env vars
SECRET_KEY = "CHANGE_ME_SUPER_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12

# ---------- Password hashing (PBKDF2) ----------
# Formato almacenado: pbkdf2$<iters>$<salt_b64>$<dk_b64>
def hash_password(password: str, iterations: int = 200_000) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, dklen=32)
    return "pbkdf2$%d$%s$%s" % (
        iterations,
        base64.b64encode(salt).decode("ascii"),
        base64.b64encode(dk).decode("ascii"),
    )

def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iters, salt_b64, dk_b64 = stored.split("$", 3)
        if algo != "pbkdf2":
            return False
        iterations = int(iters)
        salt = base64.b64decode(salt_b64.encode("ascii"))
        expected = base64.b64decode(dk_b64.encode("ascii"))
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, dklen=len(expected))
        return hmac.compare_digest(dk, expected)
    except Exception:
        return False

# Usuario demo (rápido para prueba)
DEMO_USER = {
    "username": "admin",
    # password: admin123
    "password_hash": hash_password("admin123"),
}

def create_access_token(subject: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = creds.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token")
        return sub
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")