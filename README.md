# PokeToken — Production App (Front‑end)

React + Vite + Tailwind. Šiame bundle jau įdėtas **Pikachu 30 lvl — Vortex** skin (PNG/WebP) ir manifestas.

## Quick start
```bash
npm i
npm run dev
# build
npm run build && npm run preview
```

## Deploy (Vercel)
- Prijunk repo iš GitHub.
- Env: `BOT_TOKEN`, `API_URL`, `TON_KEYS`.
- SPA routing per `vite` default (šis bundle neturi atskiro `vercel.json`; naudok esamo projekte, jei reikia).

## Assets
- `src/assets/avatars_main/pikachu_vortex_*.{png,webp}`
- `src/assets/avatars_manifest.json` (turi `Pikachu` 30 lvl su `vortex` skin)