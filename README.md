# LLM Frontend

## Run
```
npm install
npm run dev
```
Frontend: http://localhost:3000  
Backend Base URL: http://localhost:4000/api

## As of Now Includes
- App Router with Home and Experiments tabs
- Prompt input + parameter ranges with step
- Loader spinner & chart skeleton
- Error box (single message) for all input validations and other errors
- Charts: Line, Radar, Bar, Area with dummy data.
- Top-N toggle + metric selector
- Redux Toolkit, Tailwind, Recharts, next-js-themes
- Select multiple result items to compare, coparison modal, Scroll to Top
- Save responses and navigate later (Experiments tab). (with temporary JSON File storage only)
- Added Scroll-to-Top in home and experiments tabs
- Added close button in inline error box (prompt section)
- Added combo count, param count, token count chips
- Added mock data checkbox
- Increase wait time for /generate url axios call
- Show msg if real API call has more than 13 combinations
