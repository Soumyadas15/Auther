from fastapi import HTTPException, APIRouter, Depends, Response
from app.api.validators.verification_validator import VerificationRequest
from app.api.services.user.user_service import UserService
from app.utils.response_formatter import ResponseFormatter

class VerificationController:
    
    def __init__(self, user_service: UserService):
        self.user_service = user_service

    async def new_verification(self, request: VerificationRequest, response: Response = None):
        try:
            code = request.code
            await self.user_service.verify_user(code)
            
            return ResponseFormatter.created("Successfully verified")

        except HTTPException as e:
            return ResponseFormatter.error(e.detail, e.status_code)
        except Exception as e:
            print(e)
            return ResponseFormatter.error("An unexpected error occurred.", 500)