import { Router, Request, Response } from 'express';
import { AgentService } from './agent.service';
import { IAgentRepository } from './agent.repository';
import { ValidationError, NotFoundError, ConflictError } from '../errors';

export function createAgentRouter(repo: IAgentRepository): Router {
  const router = Router();
  const service = new AgentService(repo);

  router.get('/', (_req: Request, res: Response) => {
    res.json(service.listAgents());
  });

  router.get('/:id', (req: Request, res: Response) => {
    try {
      res.json(service.getAgent(req.params['id'] as string));
    } catch (err) {
      handleError(err, res);
    }
  });

  router.post('/', (req: Request, res: Response) => {
    try {
      const agent = service.createAgent(req.body as Record<string, string>);
      res.status(201).json(agent);
    } catch (err) {
      handleError(err, res);
    }
  });

  router.put('/:id', (req: Request, res: Response) => {
    try {
      res.json(service.updateAgent(req.params['id'] as string, req.body as Record<string, string>));
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
  } else if (err instanceof ConflictError) {
    res.status(409).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
