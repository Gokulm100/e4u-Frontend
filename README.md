# Dealr – React Web App

Converted from vanilla HTML/JS to a structured React app.

## Project Structure

```
src/
├── context/
│   └── AppContext.js       # Global state, API helper, auth, listings
├── components/
│   ├── Topbar.js           # Top navigation bar with search
│   ├── Sidebar.js          # Desktop sidebar navigation
│   ├── MobileNav.js        # Mobile bottom navigation
│   ├── AdCard.js           # Ad grid card component
│   └── UI.js               # Toast notifications & modal dialog
├── pages/
│   ├── HomePage.js         # Category pills, ads grid, load more
│   ├── AdDetailPage.js     # Image carousel, AI summary, chat with seller
│   ├── MessagesPage.js     # Buying/selling chat list tabs
│   ├── ChatDetailPage.js   # Full chat view with fraud banner
│   ├── PostAdPage.js       # Post/edit ad form with AI description
│   ├── MyAdsPage.js        # Manage your posted ads
│   ├── ProfilePage.js      # User profile or Google login wall
│   └── ConsentPage.js      # Privacy policy & terms, accept/revoke
├── App.js                  # Root component + page router
├── index.js                # React entry point
└── styles.css              # All global styles & design tokens
```

## Getting Started

```bash
npm install
npm start
```

## Build for Production

```bash
npm run build
```

## Notes
- Backend API: `https://e4u-backend.onrender.com`
- Google OAuth uses a popup window; the backend must send a `postMessage` with `{ type: 'google-auth', token, user }` back to the opener.
- Location data is fetched from the CountryStateCity API (Kerala cities).
- All state is managed via React Context (`AppContext`).
