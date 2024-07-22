# app/api/routes/register_routes.py

from fastapi import APIRouter, Depends, Response
from app.api.controllers.auth.register_controller import RegisterController
from app.api.services.user.user_service import UserService
from app.api.services.token.token_service import TokenService
from app.api.services.jwt.jwt_service import JWTService
from app.api.dependencies import get_user_service, get_email_service
from app.api.validators.register_validator import RegisterRequest
from app.utils.response_formatter import ResponseFormatter


router = APIRouter()

jwt_service = JWTService()
email_service = get_email_service()
token_service = TokenService(email_service)

user_service = UserService(email_service, token_service, jwt_service)

register_controller = RegisterController(user_service, token_service)

@router.post(
    "/register",
    status_code=201,
    summary="User Registration",
    description="This endpoint allows a new user to register with an email and password. Upon successful registration, a verification email will be sent to the provided email address.",
    responses={
        201: {
            "description": "Successful registration. A verification email has been sent.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Verification mail sent"
                    }
                }
            }
        },
        409: {
            "description": "Conflict. The provided email is already in use.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Email already in use."
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
async def register(request: RegisterRequest, response: Response = None):
    """
    Registers a new user and sends a verification email.

    - **request**: The registration request containing user details.
    - **response**: Optional FastAPI Response object to manage response status and headers.
    """
    
    return await register_controller.register(request, response)