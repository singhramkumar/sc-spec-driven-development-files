import { Router, Request, Response } from 'express';
import { AilmentService } from './ailment.service';
import { IAilmentRepository } from './ailment.repository';
import { IAgentRepository } from '../agents/agent.repository';
import { ValidationError, NotFoundError } from '../errors';

export function createAilmentRouter(ailmentRepo: IAilmentRepository, agentRepo: IAgentRepository): Router {
  const router = Router({ mergeParams: true });
  const service = new AilmentService(ailmentRepo, agentRepo);

  router.get('/', (req: Request, res: Response) => {
    try {
      const agentId = req.params['agentId'] as string | undefined;
      if (agentId) {
        res.json(service.listAilmentsForAgent(agentId));
      } else {
        res.json(service.listAllAilments());
      }
    } catch (err) {
      handleError(err, res);
    }
  });

  router.post('/', (req: Request, res: Response) => {
    try {
      const agentId = req.params['agentId'] as string;
      const ailment = service.createAilment(agentId, req.body as Record<string, string>);
      res.status(201).json(ailment);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.put('/:ailmentId', (req: Request, res: Response) => {
    try {
      const agentId = req.params['agentId'] as string;
      const ailmentId = req.params['ailmentId'] as string;
      res.json(service.updateAilment(agentId, ailmentId, req.body as Record<string, string>));
    } catch (err) {
      handleError(err, res);
    }
  });

  router.delete('/:ailmentId', (req: Request, res: Response) => {
    try {
      const agentId = req.params['agentId'] as string;
      const ailmentId = req.params['ailmentId'] as string;
      service.deleteAilment(agentId, ailmentId);
      res.status(204).send();
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
