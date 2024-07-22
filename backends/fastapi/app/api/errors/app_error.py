class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

    def to_dict(self):
        return {
            "error": self.message,
            "status_code": self.status_code,
        }
