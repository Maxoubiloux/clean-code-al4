import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);

    // Default error mapping
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Simple heuristic for domain errors vs others
    // Real implementation might check instanceof specific Error classes
    if (err.message) {
        if (err.message.includes('not found')) {
            statusCode = 404;
        } else if (err.message.includes('Invalid') || err.message.includes('Conflict')) {
            statusCode = 400;
        }
        message = err.message;
    }

    res.status(statusCode).json({
        error: message
    });
}
