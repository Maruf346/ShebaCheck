# ShebaCheck Frontend

Production-oriented React frontend for the ShebaCheck trust-first home services platform.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test:e2e
```

## Screens

React Router paths are available for navigation and direct linking:

- `/`
- `/search`
- `/profile?provider=<id>`
- `/booking?provider=<id>`
- `/customer-dashboard`
- `/provider-dashboard`
- `/admin-dashboard`

All provider, verification, review, booking, and ML statistics are synthetic demo data until the Django REST Framework backend is connected. Form submissions and dashboard actions currently update local UI state only; they do not create server records, authenticate users, or send notifications or payments.

## Figma Homepage

The homepage follows node `116:2` of the supplied **Plumbing and Fleet management** Figma file: amber canvas, floating navigation, search hero, featured service, technician cards, trust sections, testimonials, provider application, and footer.

- `src/components/home/`: reusable homepage components.
- `src/pages/customer/CustomerHome.tsx`: homepage state and section composition.
- Components use Tailwind utilities for layout, responsive breakpoints, and interactive states.
- `tailwind.config.js`: shared brand colors, shadows, backgrounds, and layout tokens.
- `src/data/homeContent.ts`: synthetic reference content and policy explanations.
- `public/images/providers/`: the five original photos downloaded from the supplied design export.
- Fonts are bundled locally, including a Bengali fallback for the taka symbol.

Search, category and area filters, saved-service state, navigation, dialogs, provider search filters/sorting, and the demo booking steps work locally. Provider links preserve selection across reloads, for example `/profile?provider=3`. No backend, identity verification, payment, or authentication integration is enabled.

## Browser Checks

`npm run test:e2e` uses installed Google Chrome and starts Vite on port 5173 if needed. Tests cover desktop, tablet, mobile, local image loading, horizontal overflow, home and provider search filters, dialogs, saved state, provider navigation, booking validation, dashboard actions, and direct route loads. Screenshots and failure traces are written to the ignored root `.runtime/` directory.

## Vercel

Set the project root to `frontend`, choose the **Vite** preset, use `npm run build`, and publish `dist`. Ensure the host rewrites unknown paths to `index.html` so React Router routes such as `/customer-dashboard` work on direct visits and refresh. Design exports are not needed at runtime; images and fonts are bundled with the app.
