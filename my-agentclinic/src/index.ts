import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createAgentRouter } from './agents/agent.router';
import { SqliteAgentRepository } from './agents/agent.repository';
import { AilmentService } from './ailments/ailment.service';
import { SqliteAilmentRepository } from './ailments/ailment.repository';
import { ValidationError, NotFoundError } from './errors';

const app = express();
app.use(express.json());

const agentRepo = new SqliteAgentRepository();
const ailmentRepo = new SqliteAilmentRepository();
const ailmentService = new AilmentService(ailmentRepo, agentRepo);

// Custom middleware for handling ailment routes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[AILMENT MIDDLEWARE] ${req.method} ${req.path}`);
  // Handle /ailments endpoints
  if (req.path === '/ailments') {
    console.log('[AILMENT] Matched /ailments');
    if (req.method === 'GET') {
      try {
        res.json(ailmentService.listAllAilments());
      } catch (err) {
        handleError(err, res);
      }
      return;
    }
  }

  // Handle /agents/:agentId/ailments endpoints
  const ailmentMatch = req.path.match(/^\/agents\/([^/]+)\/ailments(?:\/([^/]+))?$/);
  if (ailmentMatch) {
    const agentId = ailmentMatch[1];
    const ailmentId = ailmentMatch[2];

    try {
      if (req.path.match(/^\/agents\/[^/]+\/ailments$/) && !ailmentId) {
        // /agents/:agentId/ailments
        if (req.method === 'GET') {
          res.json(ailmentService.listAilmentsForAgent(agentId));
          return;
        } else if (req.method === 'POST') {
          const ailment = ailmentService.createAilment(agentId, req.body as Record<string, string>);
          res.status(201).json(ailment);
          return;
        }
      } else if (ailmentId) {
        // /agents/:agentId/ailments/:ailmentId
        if (req.method === 'PUT') {
          const updated = ailmentService.updateAilment(agentId, ailmentId, req.body as Record<string, string>);
          res.json(updated);
          return;
        } else if (req.method === 'DELETE') {
          ailmentService.deleteAilment(agentId, ailmentId);
          res.status(204).send();
          return;
        }
      }
    } catch (err) {
      handleError(err, res);
      return;
    }
  }

  // Pass to next middleware if not an ailment route
  next();
});

// Mount the agent router
app.use('/agents', createAgentRouter(agentRepo));

// Static files and fallback
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

function handleError(err: unknown, res: express.Response): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const PORT = process.env['PORT'] ?? 3000;
app.listen(PORT, () => {
  console.log(`AgentClinic running on port ${PORT}`);
});
