from abc import ABC, abstractmethod
from typing import Any
from pydantic import EmailStr

class ITokenService(ABC):

    @abstractmethod
    async def generate_verification_token(self, email: EmailStr) -> Any:
        pass

    # @abstractmethod
    # async def get_verification_token_by_token(self, token: str) -> Any:
    #     pass

    # @abstractmethod
    # async def get_two_factor_token_by_email(self, email: EmailStr) -> Any:
    #     pass

    # @abstractmethod
    # async def generate_password_reset_token(self, email: EmailStr) -> Any:
    #     pass

    # @abstractmethod
    # async def get_password_reset_token_by_token(self, token: str) -> Any:
    #     pass

    # @abstractmethod
    # async def generate_two_factor_token(self, email: EmailStr) -> Any:
    #     pass
