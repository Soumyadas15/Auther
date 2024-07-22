import jwt
import datetime
from typing import Any, Dict

class JWTService:
    def __init__(self, algorithm: str = "HS256", expiration_minutes: int = 60):
        self.secret_key = 'soumya'
        self.algorithm = algorithm
        self.expiration_minutes = expiration_minutes

    def create_token(self, userId: str) -> str:
        expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=self.expiration_minutes)
        payload = {
            "userId": userId,
            "exp": expiration
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token

    def verify_token(self, token: str) -> Dict[str, Any]:
        try:
            decoded_payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return decoded_payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired.")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token.")
