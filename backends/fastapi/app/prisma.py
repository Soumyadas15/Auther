from prisma import Prisma

prisma = Prisma()

async def init_db():
    await prisma.connect()

async def close_db():
    await prisma.disconnect()
