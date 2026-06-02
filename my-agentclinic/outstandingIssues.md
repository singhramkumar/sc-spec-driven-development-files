# Outstanding Issues

_No outstanding issues._

## Resolved: Express Route Matching Failure for Ailment Endpoints

**Resolved on 2026-06-02.**

The ailment API endpoints are now fully functional. The fix was to use `app.use('/agents/:agentId/ailments', createAilmentRouter(...))` with the existing `ailment.router.ts` (which uses `Router({ mergeParams: true })`), plus a single `app.get('/ailments', ...)` handler for the global list endpoint.

All routes verified working:
- `GET    /ailments` → 200
- `POST   /agents/:agentId/ailments` → 201
- `GET    /agents/:agentId/ailments` → 200
- `PUT    /agents/:agentId/ailments/:ailmentId` → 200
- `DELETE /agents/:agentId/ailments/:ailmentId` → 204
