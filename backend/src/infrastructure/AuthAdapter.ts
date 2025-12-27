import { Request, Response, NextFunction } from 'express';
// import { UserContext } from '../../ports/UserContext';

// This middleware mimics an authentication layer.
// Ideally, it would populate a UserContext available in the request or a DI container.
export const authMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    // For now, valid for everyone (Anonymous).
    // In future: Verify token, extract user ID, set to context.
    // console.log('[AuthAdapter] Passing as Anonymous');
    next();
};
