from fastapi import HTTPException, APIRouter, Depends, Response
from app.api.validators.register_validator import RegisterRequest
from app.api.services.user.user_service import UserService
from app.utils.response_formatter import ResponseFormatter
from app.api.services.token.token_service import TokenService

class RegisterController:
    def __init__(self, user_service: UserService, token_service: TokenService):
        self.user_service = user_service
        self.token_service = token_service

    async def register(self, request: RegisterRequest, response: Response = None):
        try:
            user = await self.user_service.register_user(request)
            await self.token_service.generate_verification_token(user.email)
            
            return ResponseFormatter.success("Verification mail sent")

        except HTTPException as e:
            return ResponseFormatter.error(e.detail, e.status_code)
        except Exception as e:
            print(e)
            return ResponseFormatter.error("An unexpected error occurred.", 500)