from app.prisma import prisma
from app.config import get_password_hash
from app.api.validators.register_validator import RegisterRequest
from prisma import Prisma
from fastapi import HTTPException, status
from app.api.services.email.email_service import EmailService
from app.api.services.token.token_service import TokenService
from app.api.services.jwt.jwt_service import JWTService
from app.api.errors.app_error import AppError
from datetime import datetime, timedelta
import pytz
from app.config import verify_password

class UserService:
    def __init__(self, email_service: EmailService, token_service: TokenService, jwt_service: JWTService):
        self.prisma = prisma
        self.email_service = email_service
        self.token_service = token_service
        self.jwt_service = jwt_service

    async def get_user_by_email(self, email: str):
        user = await self.prisma.user.find_unique(
            where={"email": email}
        )
        return user
    
    async def get_user_by_id(self, userId: str):
        user = await self.prisma.user.find_unique(
            where={"id": userId}
        )
        return user
        
    async def register_user(self, request: RegisterRequest):
        existing_user = await self.get_user_by_email(request.email)
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use."
            )
            

        user = await self.prisma.user.create(
            data={
                "email": request.email,
                "name": request.name,
                "password": get_password_hash(request.password),
                "provider": "credentials"
            }
        )
        
        return user
    
    
    
    
    async def verify_user(self, token: str):
        existing_token = await self.token_service.get_verification_token_by_token(token)
        
        if not existing_token:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid token"
            )
        
        has_expired = existing_token.expires < datetime.utcnow().replace(tzinfo=pytz.UTC)
        if has_expired:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        
        existing_user = await self.get_user_by_email(existing_token.email)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not exist"
            )
        
        await prisma.user.update(
            where= { 'email' : existing_user.email },
            data= { 'emailVerified' : datetime.now(pytz.UTC) }
        )
        
        await prisma.verificationtoken.delete(
            where= { 'id' : existing_token.id }
        )
        
    
    async def get_two_factor_confirmation_by_user_id(self, userId: str):
        twoFactorConfirmation = await self.prisma.twofactorconfirmation.find_unique(
                                    where= { 'userId' : userId }
                                )
        return twoFactorConfirmation
        
        
    async def user_credentials_login(self, email: str, password: str):
        user = await self.get_user_by_email(email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        password_match = verify_password(password, user.password)
        if not password_match:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid credentials"
            )
        
        token = self.jwt_service.create_token(user.id)
        
        return {
            "user": {
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "image": user.image,
            },
            "token": token,
        }