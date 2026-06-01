# Tech Stack

## Server

- **Language & Runtime**: Node.js with TypeScript (strict mode)
- **Framework**: Express.js for its simplicity, widespread adoption, and suitability for learning
- **Build**: TypeScript compiler (tsc) to CommonJS, target ES2016

## Database

- **SQLite** for data persistence (file-based, no server required, ideal for development and demos)

## Frontend (Web UI)

- **HTML5** for semantic markup
- **CSS3** with mobile-first responsive design approach (media queries, flexible layouts, fluid typography)
- **JavaScript/TypeScript** for interactivity
- **CSS Framework** (TBD): Consider Tailwind CSS, Bootstrap, or vanilla CSS for responsive grid systems and component styling
- **Responsive Design Principles**:
  - Mobile-first design approach
  - Flexible grid layouts (CSS Grid, Flexbox)
  - Media queries for breakpoints (mobile, tablet, desktop)
  - Responsive images and typography
  - Touch-friendly interface for mobile devices
  - Accessible keyboard navigation

## TypeScript Configuration

- Strict mode enabled
- `esModuleInterop` enabled for CommonJS compatibility
- Output to `dist/` directory

## Development

- `npm install` to install dependencies
- `npm run build` to compile TypeScript
- `node dist/index.js` to run the application
