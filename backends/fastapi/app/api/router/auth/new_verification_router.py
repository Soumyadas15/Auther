# app/api/routes/register_routes.py

from fastapi import APIRouter, Depends, Response
from app.api.controllers.auth.verification_controller import VerificationController
from app.api.services.user.user_service import UserService
from app.api.services.token.token_service import TokenService
from app.api.services.jwt.jwt_service import JWTService
from app.api.dependencies import get_user_service, get_email_service
from app.api.validators.verification_validator import VerificationRequest
from app.utils.response_formatter import ResponseFormatter


router = APIRouter()

jwt_service =   JWTService()
email_service = get_email_service()
token_service = TokenService(email_service)
user_service = UserService(email_service, token_service, jwt_service)
verification_controller = VerificationController(user_service)

@router.post(
    "/new-verification",
    status_code=201,
    summary="New user verification",
    description="This endpoint allows a new user to verify their upon successfl registration account",
    responses={
        200: {
            "description": "Success. Successful verification.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Verification successful"
                    }
                }
            }
        },
        401: {
            "description": "Unauthorized. The token has expired.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Token has expired"
                    }
                }
            }
        },
        404: {
            "description": "Conflict. The token does not exist.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invaid token"
                    }
                }
            }
        },
        500: {
            "description": "Internal Server Error. An unexpected error occurred.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "An unexpected error occurred."
                    }
                }
            }
        }
    }
)
async def new_verification(request: VerificationRequest, response: Response = None):
    """
    Verifies a new user by matching tokens.

    - **request**: The verification request containing the token.
    - **response**: Optional FastAPI Response object to manage response status and headers.
    """
    
    return await verification_controller.new_verification(request, response)