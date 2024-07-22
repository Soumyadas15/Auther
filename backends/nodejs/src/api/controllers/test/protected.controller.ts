import { Request, Response } from 'express';

import { ResponseFormatter } from '../../../utils/response-formatter';
import { ICustomResponse } from './ICustomResponse';

export const protectedRoute = (req: Request, res: Response) => {
    const userId = res.locals.userId;
    return ResponseFormatter.success(res, "This is a protected route", { userId: userId })
};