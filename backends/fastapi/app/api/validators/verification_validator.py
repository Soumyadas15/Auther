from pydantic import BaseModel, EmailStr, constr, validator

class VerificationRequest(BaseModel):
    code: constr(min_length=1)
    
    @validator('code')
    def validate_code(cls, v):
        if len(v) < 6:
            raise ValueError("Code should be 6 digits long")
        return v