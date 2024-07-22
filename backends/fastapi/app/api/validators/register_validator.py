from pydantic import BaseModel, EmailStr, constr, validator

class RegisterRequest(BaseModel):
    name: constr(min_length=1)
    email: EmailStr
    password: constr(min_length=6)

    @validator('name')
    def validate_name(cls, v):
        if not v:
            raise ValueError("Name is required")
        return v

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password should be a minimum of 6 characters long")
        return v
