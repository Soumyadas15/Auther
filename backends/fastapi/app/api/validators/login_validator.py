from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=1)
    code: Optional[str] = None

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 1:
            raise ValueError("Password is required")
        return v
