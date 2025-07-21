import { z, ZodError } from 'zod';

import { Request, Response, Router } from 'express';
import { GetCompanyProfileUseCase } from '../application/GetCompanyProfileUseCase';
import { GetHistoricalDataUseCase } from '../application/GetHistoricalDataUseCase';


export const MarketDataHistoryQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "'from' must be in YYYY-MM-DD format",
  }),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "'to' must be in YYYY-MM-DD format",
  }),
  period: z.enum(["d", "w", "m"]).optional(),
});


function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

export function MarketdataController(
  getCompanyProfileUseCase: GetCompanyProfileUseCase,
  getHistoricalDataUseCase: GetHistoricalDataUseCase
): Router {
  const router = Router();

  router.get('/companies/:symbol/profile', async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol;
      const result = await getCompanyProfileUseCase.execute(symbol);

      if (!result) {
        return res.status(404).json({ code: 404, message: 'Company not found' });
      }

      return res.json(result);
    } catch (error: unknown) {
      if (isZodError(error)) {
        return res.status(400).json({
          code: 400,
          message: 'Validation error',
          details: error.flatten()
        });
      }
      return res.status(500).json({
        code: 500,
        message: 'Unexpected server error'
      });
    }
  });

  router.get('/market-data/history/:symbol', async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol;

      const parseResult = MarketDataHistoryQuerySchema.safeParse(req.query);
      if (!parseResult.success) {
        return res.status(400).json({
          code: 400,
          message: 'Validation failed',
          details: parseResult.error.flatten()
        });
      }

      const { from, to, period } = parseResult.data;
      const result = await getHistoricalDataUseCase.execute(symbol, from, to, period);
      

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: 'Data not found'
        });
      }

      return res.json(result);
    } catch (error: unknown) {
      if (isZodError(error)) {
        return res.status(400).json({
          code: 400,
          message: 'Validation error',
          details: error.flatten()
        });
      }
      return res.status(500).json({
        code: 500,
        message: 'Unexpected server error'
      });
    }
  });

  return router;
}
