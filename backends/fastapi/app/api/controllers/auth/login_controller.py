from fastapi import HTTPException, APIRouter, Depends, Response
from app.api.validators.login_validator import LoginRequest
from app.api.services.user.user_service import UserService
from app.api.services.email.email_service import EmailService
from app.utils.response_formatter import ResponseFormatter
from app.api.services.token.token_service import TokenService
from app.config import verify_password
from app.api.errors.auth_error import AuthError
import pytz
from datetime import datetime, timedelta
from app.prisma import prisma


class LoginController:
    
    def __init__(self, user_service: UserService, token_service: TokenService, email_service: EmailService):
        self.user_service = user_service
        self.token_service = token_service
        self.email_service = email_service

    async def login(self, request: LoginRequest, response: Response = None):
        try:
            email = request.email
            password = request.password
            code = request.code
            
            existing_user = await self.user_service.get_user_by_email(email)
            if not existing_user: return ResponseFormatter.error("User does not exist", 404)
            
            if existing_user.provider != 'credentials':
                return ResponseFormatter.error("Email is in use with another provider", 409)
            
            if not existing_user: return ResponseFormatter.error("User does not exist", 404)
            
            passwordMatch = verify_password(password, existing_user.password)
            if not passwordMatch: return ResponseFormatter.error("Invaid credentials", 401)
            
            if not existing_user.emailVerified != 'credentials':
                await self.token_service.generate_verification_token(user.email)
                return ResponseFormatter.success("Verification mail sent again")
            
            if existing_user.isTwoFactorEnabled and existing_user.email:
                if code:
                    two_factor_token = await self.token_service.get_two_factor_token_by_email(existing_user.email)
                    
                    if not two_factor_token: return ResponseFormatter.error("Invaid token", 400)
                    if two_factor_token.token != code: return ResponseFormatter.error("Invaid token", 400)
                    
                    has_expired = two_factor_token.expires < datetime.utcnow().replace(tzinfo=pytz.UTC)
                    if has_expired: return ResponseFormatter.error("Token has expired", 403)
                    
                    await prisma.twofactortoken.delete(
                        where={ "id" : two_factor_token.id }
                    )
                    existing_confirmation = await self.user_service.get_two_factor_confirmation_by_user_id(existing_user.id)
                    
                    if existing_confirmation:
                        await prisma.twofactorconfirmation.delete(
                            where= {
                                "id": existing_confirmation.id
                            }
                        )
                
                    await prisma.twofactorconfirmation.create(
                        data= {
                            "userId": existing_user.id
                        }
                    );
                else:
                    two_factor_token = await self.token_service.generate_two_factor_token(existing_user.email)
                    await self.email_service.send_two_factor_email(
                        two_factor_token.email,
                        two_factor_token.token
                    )
                    return ResponseFormatter.success("Two factor email sent", { "twofactor": True })
                    
                
            user = await self.user_service.user_credentials_login(email, password)
            if not user: return ResponseFormatter.error("Invalid credentials", 401)
            
            return ResponseFormatter.success("Success", user)
                

        except HTTPException as e:
            return ResponseFormatter.error(e.detail, e.status_code)
        except Exception as e:
            print(e)
            return ResponseFormatter.error("An unexpected error occurred.", 500)