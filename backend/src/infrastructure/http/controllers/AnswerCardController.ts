import { Request, Response, NextFunction } from 'express';
import { AnswerCard } from '../../../application/AnswerCard';

export class AnswerCardController {
    constructor(private answerCard: AnswerCard) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { cardId } = req.params;
            const { userAnswer } = req.body;

            if (!cardId) {
                res.status(400).json({ error: 'Missing cardId' });
                return;
            }

            if (!userAnswer) {
                res.status(400).json({ error: 'Missing userAnswer' });
                return;
            }

            const result = await this.answerCard.execute({
                cardId,
                userAnswer
            });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
