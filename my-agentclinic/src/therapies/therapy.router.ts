import { Router, Request, Response } from 'express';
import { TherapyService } from './therapy.service';
import { ITherapyRepository } from './therapy.repository';
import { ValidationError, NotFoundError } from '../errors';

export function createTherapyRouter(repo: ITherapyRepository): Router {
  const router = Router();
  const service = new TherapyService(repo);

  router.get('/', (req: Request, res: Response) => {
    try {
      const query = req.query as Record<string, string | undefined>;
      res.json(service.listTherapies(query));
    } catch (err) {
      handleError(err, res);
    }
  });

  router.get('/:id', (req: Request, res: Response) => {
    try {
      res.json(service.getTherapy(req.params['id'] as string));
    } catch (err) {
      handleError(err, res);
    }
  });

  return router;
}

function handleError(err: unknown, res: Response): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
