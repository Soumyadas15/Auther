import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import HTTPException

class EmailService:
    
    def __init__(self, smtp_server: str, smtp_port: int, smtp_user: str, smtp_password: str):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password

    async def send_email(self, to: str, subject: str, body: str):
        msg = MIMEMultipart()
        msg['From'] = self.smtp_user
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        context = ssl.create_default_context()
        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    async def send_verification_email(self, to: str, code: str):
        subject = "Welcome to Auther"
        body = f"Your verification code is {code}"
        await self.send_email(to, subject, body)
        
        
    async def send_two_factor_email(self, to: str, code: str):
        subject = "Two factor authentication"
        body = f"Your two factor code is {code}"
        await self.send_email(to, subject, body)