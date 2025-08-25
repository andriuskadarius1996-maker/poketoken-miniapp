# PokeToken • Season 1 (Telegram Mini-App Demo)

This is a front-end demo (no backend, no wallet) for your Telegram WebApp. Host it over HTTPS and attach the URL to your bot via BotFather.

## Quick start
```bash
npm i
npm run dev
```
Open http://localhost:5173

## Build & Deploy (Netlify or Vercel)
```bash
npm run build
```
Upload the `dist/` folder to Netlify (Drop folder) or deploy via Vercel (`vercel --prod`).

## Telegram
- Open @BotFather → /setmenubutton → choose your bot → Web App
- Title: PokeToken
- URL: https://<your-host>.netlify.app or https://<your-host>.vercel.app
