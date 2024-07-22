from typing import Any
from pydantic import EmailStr
import random
from datetime import datetime, timedelta
import pytz

from app.prisma import prisma
from app.api.services.email.email_service import EmailService
from app.api.services.token.i_token_service import ITokenService

class TokenService(ITokenService):
    def __init__(self, email_service: EmailService):
        self.prisma = prisma
        self.email_service = email_service
    
    def generate_random_code(self, length: int = 6) -> str:
        characters = '0123456789'
        code = ''.join(random.choice(characters) for _ in range(length))
        return code
    
    
    
    
    
    
    async def get_verification_token_by_email(self, email: str) -> Any:
        token = await prisma.verificationtoken.find_first(
            where={"email": email}
        )
        return token
    
    
    async def get_verification_token_by_token(self, token: str) -> Any:
        token_record = await prisma.verificationtoken.find_unique(
            where={"token": token}
        )
        return token_record
    
    
    
    
    async def get_two_factor_token_by_token(self, token: str) -> Any:
        token_record = await prisma.twofactortoken.find_unique(
            where={"token": token}
        )
        return token_record
    
    
    async def get_two_factor_token_by_email(self, email: str) -> Any:
        token = await prisma.twofactortoken.find_first(
            where={"email": email}
        )
        return token
    
    
    
    
    
    
    async def delete_existing_token(self, email: str, token_type: str) -> None:
        try:
            existing_token = None
            
            if token_type == "verification":
                existing_token = await self.get_verification_token_by_email(email);
                if existing_token:
                    await prisma.verificationtoken.delete(
                    where={" id": existing_token.id }
                )
            
            if token_type == "twoFactor":
                existing_token = await self.get_two_factor_token_by_email(email);
                if existing_token:
                    await prisma.twofactortoken.delete(
                        where={" id": existing_token.id }
                    )
                    
        except Exception as e:
            raise Exception(f"Error deleting {token_type} token: {e}")
        
        
        
        
        
    
    async def generate_verification_token(self, email: str) -> Any:
        token = self.generate_random_code()
        expires = datetime.utcnow().replace(tzinfo=pytz.UTC) + timedelta(minutes=10)
        try:
            await self.delete_existing_token(email, 'verification')
            verification_token = await prisma.verificationtoken.create(
                data={
                    "email": email,
                    "token": token,
                    "expires": expires
                }
            )
            
            await self.email_service.send_verification_email(email, token)
            return verification_token
            
        except Exception as error:
            print(f"Error generating verification token for {email}:", error)
            raise Exception('Failed to generate verification token')
        
        
        
        
        
    async def generate_two_factor_token(self, email: str) -> Any:
        token = self.generate_random_code()
        expires = datetime.utcnow().replace(tzinfo=pytz.UTC) + timedelta(minutes=10)
        try:
            await self.delete_existing_token(email, 'twoFactor')
            two_factor_token = await prisma.twofactortoken.create(
                data={
                    "email": email,
                    "token": token,
                    "expires": expires
                }
            )
            
            return two_factor_token
            
        except Exception as error:
            print(f"Error generating two factor token for {email}:", error)
            raise Exception('Failed to generate verification token')