# Chanel × Rabino 1895 — Invito digitale

Pagina statica React (Vite) a scorrimento unico, mobile-first: invito digitale a 3 stati (`teaser` → `form` → `details`).

## Sviluppo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # output in dist/
npm run preview
```

## Asset

Sostituisci i placeholder in `public/assets/` con i file definitivi:

| File | Uso |
|------|-----|
| `elefantino.png` | Icona teaser (112px) |
| `j12-hero.jpg` | Hero dettagli (aspect 3/4) |
| `rabino-wordmark.png` | Logo footer (150px) |

## Form / RSVP

Le submission vanno in POST a FormSubmit (`eventi@gioielleriarabino.com`). Sostituisci `FORM_ENDPOINT` in `src/App.jsx` con l’endpoint reale quando disponibile.

## Deploy (Vercel / Netlify)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- Punta un CNAME (es. `invito.gioielleriarabino.com`) al dominio fornito dalla piattaforma.
