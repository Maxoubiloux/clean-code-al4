import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { User } from '../../../domain/User';
import { UserId } from '../../../domain/UserId';
import { UserRepository } from '../../../ports/UserRepository';
import { Clock } from '../../../ports/Clock';

export class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly clock: Clock
    ) { }

    async handleLogin(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: { message: 'Missing email or password' } });
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || user.getPasswordHash() !== password) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Les identifiants fournis sont invalides'
                }
            });
        }

        const token = Buffer.from(user.getId().getValue()).toString('base64');
        return res.json({ token, user: { id: user.getId().getValue(), email: user.getEmail(), name: user.getName(), createdAt: user.getCreatedAt() } });
    }

    async handleRegister(req: Request, res: Response) {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_DATA',
                    message: 'Données invalides'
                }
            });
        }

        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            return res.status(409).json({
                error: {
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'Email déjà utilisé'
                }
            });
        }

        const userId = UserId.create(randomUUID());
        const user = User.create(userId, email, name, password, this.clock.now());
        await this.userRepository.save(user);

        const token = Buffer.from(userId.getValue()).toString('base64');
        return res.status(201).json({
            token,
            user: {
                id: userId.getValue(),
                email: user.getEmail(),
                name: user.getName(),
                createdAt: user.getCreatedAt()
            }
        });
    }
}
