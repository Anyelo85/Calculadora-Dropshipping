import { Router } from 'express';
import { postCalculate, postProductScore } from '../controllers/calculator.controller';

export const calculatorRouter = Router();

calculatorRouter.post('/', postCalculate);
calculatorRouter.post('/score', postProductScore);
