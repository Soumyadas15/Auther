import jwt from 'jsonwebtoken';

interface JwtPayload {
  exp: number;
}

export function isJwtExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded || typeof decoded.exp !== 'number') {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}
