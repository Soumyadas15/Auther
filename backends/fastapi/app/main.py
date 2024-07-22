import uvicorn
from fastapi import FastAPI
from app.prisma import init_db, close_db, prisma
from app.api.router.auth.register_router import router as register_router
from app.api.router.auth.new_verification_router import router as verification_router
from app.api.router.auth.login_router import router as login_router


app = FastAPI()


app.include_router(register_router, prefix="/api/auth")
app.include_router(verification_router, prefix="/api/auth")
app.include_router(login_router, prefix="/api/auth")

@app.on_event("startup")
async def startup():
    await init_db()
    
    
@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()
    
    
@app.get("/")
async def root():
    return {"message": "Hello World - from fastAPI"}