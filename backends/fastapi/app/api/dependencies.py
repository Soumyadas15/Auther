from fastapi import Depends
from app.api.services.user.user_service import UserService
from app.api.services.email.email_service import EmailService


def get_email_service() -> EmailService:
    return EmailService(
        smtp_server="smtp.gmail.com",
        smtp_port=587,
        smtp_user="soumyaxpvt@gmail.com",
        smtp_password="owli xmug fcfz jcvb" 
    )
    
def get_user_service(email_service: EmailService = Depends(get_email_service)) -> UserService:
    return UserService(email_service=email_service)