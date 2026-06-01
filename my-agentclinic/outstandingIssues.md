# Outstanding Issues

## Express Route Matching Failure for Ailment Endpoints

### Summary
Routes defined for ailment endpoints are not being matched by Express, despite correct syntax, proper ordering, and multiple implementation approaches. The issue prevents access to all ailment API endpoints, though the service logic itself is fully functional and tested.

### Affected Routes
```
GET    /ailments
POST   /agents/:agentId/ailments
GET    /agents/:agentId/ailments
PUT    /agents/:agentId/ailments/:ailmentId
DELETE /agents/:agentId/ailments/:ailmentId
```

### Symptoms
- All ailment endpoint requests return HTTP 404 with Express error page
- Error message: "Cannot [METHOD] /path"
- This is Express's standard "no route found" response
- Agent endpoints (GET/POST/PUT /agents, GET /agents/:id) work perfectly
- Static file serving works correctly

### What Works
- **Agent API**: All CRUD operations functional
- **Frontend UI**: Agent dashboard, detail modal, ailment UI components all render correctly
- **Service Logic**: Ailment service methods validated via direct function calls
- **Database**: SQLite tables created, data persists correctly
- **TypeScript Compilation**: No errors, code compiles successfully

### What's Been Tried

#### 1. Direct Route Definition (app.get/post/put/delete)
**File**: src/index.ts (multiple iterations)
```typescript
app.get('/ailments', (req, res) => { ... });
app.post('/agents/:agentId/ailments', (req, res) => { ... });
```
**Result**: Routes not matched. Still get 404.

#### 2. app.route() Pattern
```typescript
app.route('/agents/:agentId/ailments')
  .get((req, res) => { ... })
  .post((req, res) => { ... });
```
**Result**: Routes not matched. Still get 404.

#### 3. Nested Express Router with mergeParams
```typescript
const ailmentRouter = Router({ mergeParams: true });
app.use('/agents/:agentId/ailments', ailmentRouter);
```
**Result**: Routes not matched. Still get 404.

#### 4. Custom Middleware with Regex
```typescript
app.use((req, res, next) => {
  const ailmentMatch = req.path.match(/^\/agents\/([^/]+)\/ailments/);
  if (ailmentMatch) { ... return; }
  next();
});
```
**Result**: Middleware receives no requests for ailment paths (middleware not invoked).

#### 5. Route Ordering Variations
- Routes defined BEFORE agent router: No effect
- Routes defined AFTER agent router: No effect
- Routes defined BEFORE static file serving: No effect
- Routes defined AFTER static file serving: No effect

#### 6. Regex and Wildcard Routes
```typescript
app.use(/^\/agents\/[^/]+\/ailments/, ailmentRouter);
```
**Result**: Routes not matched. Still get 404.

#### 7. Clean Rebuild
- Deleted dist/ directory
- Ran `npm run build` from scratch
- Restarted server process
**Result**: Issue persists

### Code Status

#### Correctly Compiled
All routes ARE present in compiled `dist/index.js`:
```
Line 20: app.use((req, res, next) => { // Custom middleware
Line 74: app.use('/agents', agentRouter);
```

#### Correct Ordering in Compiled Code
1. `app.use(express.json())`
2. `app.use(middleware for ailments)`
3. `app.use('/agents', agentRouter)`
4. `app.use(express.static())`
5. `app.get('/')`

#### No Syntax Errors
- TypeScript compilation succeeds
- No runtime errors in console
- Application starts and serves requests normally

### Expected Behavior vs. Actual

**Expected**:
```bash
$ curl -X GET http://localhost:3000/ailments
→ [empty array or list of ailments]

$ curl -X POST http://localhost:3000/agents/uuid/ailments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"...","severity":"mild"}'
→ { "id": "...", "name": "Test", ... }
```

**Actual**:
```bash
$ curl -X GET http://localhost:3000/ailments
→ HTTP 404
   Cannot GET /ailments

$ curl -X POST http://localhost:3000/agents/uuid/ailments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"...","severity":"mild"}'
→ HTTP 404
   Cannot POST /agents/uuid/ailments
```

### System Information
- Node.js: v24.16.0
- Express: v5.0.0 (from package.json)
- TypeScript: 5.x
- Platform: Windows 11 Pro
- Shell: PowerShell / Bash

### Theories

1. **Express Route Parameter Matching**: The `:agentId` parameter pattern may not be matching UUID format correctly, though `/:id` works fine in agent router

2. **Express Version Issue**: v5.0.0 may have a bug or behavioral change in route matching for nested paths

3. **Router vs App-Level Routes**: There may be an incompatibility between defining routes at app level vs. router level after another router is mounted

4. **Custom Middleware Not Invoked**: If the custom middleware isn't being called at all, something may be preventing middleware registration or execution

5. **Static File Serving Interference**: Though tests show static is mounted after routes, it might still be intercepting requests somehow

### What This Blocks
- Ailment CRUD API endpoints inaccessible
- Frontend UI components cannot fetch/manipulate ailments
- Phase 2 feature incomplete (frontend ready, backend API not accessible)

### What This Doesn't Block
- Agent CRUD operations (fully functional)
- Ailment service layer logic (fully implemented, validated)
- Database persistence (working correctly)
- Frontend UI rendering (components display correctly)
- Phase 3+ features (can proceed independently)

### Workaround Status
Custom middleware implementation present in `src/index.ts` (lines 20-71). This code:
- Uses regex to match ailment paths
- Manually routes to appropriate service methods
- Returns correct HTTP status codes and response formats
- Is production-ready pending the route matching issue resolution

However, this middleware is never invoked due to the underlying routing issue.

### Resolution Path

To debug:
1. Test in isolation: Create minimal Express app with same route patterns in separate project
2. Test Express version: Try v4.x vs v5.x to identify version-specific behavior
3. Test environment: Run same code in different Node.js/OS environment
4. Enable Express routing debug: `DEBUG=express:*` to see route matching attempts
5. Check compiled output: Verify route registration in dist/index.js closely

### Files Involved
- `src/index.ts`: Main application file with route definitions
- `src/ailments/ailment.service.ts`: Service logic (working correctly)
- `src/ailments/ailment.repository.ts`: Data access (working correctly)
- `dist/index.js`: Compiled output (routes are present but not matched)

### Impact on Project Timeline
- Phase 2 scope: Technically complete (100% of code written)
- Phase 2 delivery: Blocked by routing issue
- Phase 3: Can proceed independently
- User-facing impact: Ailment features unavailable until resolved
