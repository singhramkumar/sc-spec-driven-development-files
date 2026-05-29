# Tech Stack

## Server

- **Language & Runtime**: Node.js with TypeScript (strict mode)
- **Framework**: Express.js for its simplicity, widespread adoption, and suitability for learning
- **Build**: TypeScript compiler (tsc) to CommonJS, target ES2016

## Database

- **SQLite** for data persistence (file-based, no server required, ideal for development and demos)

## TypeScript Configuration

- Strict mode enabled
- `esModuleInterop` enabled for CommonJS compatibility
- Output to `dist/` directory

## Development

- `npm install` to install dependencies
- `npm run build` to compile TypeScript
- `node dist/index.js` to run the application
