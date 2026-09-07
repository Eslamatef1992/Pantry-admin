# Pantry Admin (makanifoods.com admin panel)

React (Vite) admin panel for the Makani Foods / Pantry e-commerce platform: products,
categories, orders, and payment method settings (KNET / Sadad / Cash on Delivery toggles).

Sibling repos:
- API: https://github.com/Eslamatef1992/pantry-api
- Storefront: https://github.com/Eslamatef1992/Pantry-website

## Setup

```bash
cp .env.example .env   # set VITE_API_URL to the running API
npm install
npm run dev              # http://localhost:5174
```

Seeded admin login (from the API's `npm run seed`): `admin@makanifoods.com` / `ChangeMe123!`.
