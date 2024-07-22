class AuthError(Exception):
    def __init__(self, error_type: str, message: str = None):
        super().__init__(message)
        self.type = error_type
        self.name = "AuthError"