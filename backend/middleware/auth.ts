// middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const api_key = 'pupladderized';

export interface AuthenticatedRequest extends Request {
    isAuthenticated?: boolean;
}

export const apiKeyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['auth-api-key'];

    if (!apiKey) {
        res.status(401).json({
            error: 'API Key is required'
        });
        return;
    }

    if (apiKey !== api_key) {
        res.status(403).json({
            error: 'Invalid API Key'
        });
        return;
    }

    req.isAuthenticated = true;
    next();
};

// Optional: Create a middleware to protect specific routes
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated) {
        res.status(401).json({
            error: 'Authentication required'
        });
        return;
    }
    next();
};