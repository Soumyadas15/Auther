import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

class RateLimiter {
  private limiter;

  constructor(maxRequests: number, windowMs: number) {
    this.limiter = rateLimit({
      windowMs: windowMs,
      max: maxRequests,
      message: {
        message: "Spam detected, please try again later",
      },
    });
  }

  public apply(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}

export default RateLimiter;
