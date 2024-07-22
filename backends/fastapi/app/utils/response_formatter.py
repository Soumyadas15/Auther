from fastapi.responses import JSONResponse

class ResponseFormatter:
    @staticmethod
    def success(message: str, data: dict = None):
        return JSONResponse(
            content={
                "status": "success",
                "message": message,
                "data": data,
            },
            status_code=200
        )

    @staticmethod
    def created(message: str, data: dict = None):
        return JSONResponse(
            content={
                "status": "success",
                "message": message,
                "data": data,
            },
            status_code=201
        )

    @staticmethod
    def error(message: str, status_code: int):
        return JSONResponse(
            content={
                "status": "error",
                "message": message,
            },
            status_code=status_code
        )
