# app/api/routes/register_routes.py

from fastapi import APIRouter, Depends, Response
from app.api.controllers.auth.login_controller import LoginController
from app.api.services.user.user_service import UserService
from app.api.services.token.token_service import TokenService
from app.api.dependencies import get_user_service, get_email_service
from app.api.validators.login_validator import LoginRequest
from app.utils.response_formatter import ResponseFormatter
from app.api.services.jwt.jwt_service import JWTService


router = APIRouter()


jwt_service =   JWTService()
email_service = get_email_service()
token_service = TokenService(email_service)
user_service = UserService(email_service, token_service, jwt_service)
login_controller = LoginController(user_service, token_service, email_service)

@router.post(
    "/login",
    status_code=200,
    summary="User Login",
    description="This endpoint allows a user to login",
    responses={
        201: {
            "description": "Successful login",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Success"
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
async def login(request: LoginRequest, response: Response = None):
    """
    Logs in a user and sends a token.

    - **request**: The registration request containing user details.
    - **response**: Optional FastAPI Response object to manage response status and headers.
    """
    
    return await login_controller.login(request, response)