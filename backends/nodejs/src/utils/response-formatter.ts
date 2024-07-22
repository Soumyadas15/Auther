import { Response } from 'express';

export class ResponseFormatter {
    static success(res: Response, message: string, data?: any) {
        return res.status(200).json({
            status: 'success',
            message,
            data,
        });
    }

    static created(res: Response, message: string, data?: any) {
        return res.status(201).json({
            status: 'success',
            message,
            data,
        });
    }

    static error(res: Response, statusCode: number, message: string) {
        return res.status(statusCode).json({
            status: 'error',
            message,
        });
    }
}
