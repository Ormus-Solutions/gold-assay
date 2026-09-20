# gold-assay

> Screenshots lie until you assay them. OCR + DOM in, karat verdict out — don't stamp GREEN on fool's gold.

**@ormus/gold-assay** is the **Vibium annex**: score UI proofs (OCR text, role/DOM summaries, expect/forbid signals) before a browser agent claims the flow worked. Think liquid-gold QA for agent UIs.

Aligned with **Jev scoring habits** from TypeSafe & Vercel guides, and the free master-Jev ethos: explicit evidence, calibrated confidence, fail closed on toxins (error toasts, 404s).

## Install

```bash
npm i @ormus/gold-assay
```

## Quick pour

```ts
import { assay, assayFlow } from '@ormus/gold-assay';

assay({
  ocrText: 'Order confirmed. Confirmation #A-1042',
  domSummary: 'status:success',
  expect: ['Order confirmed'],
  forbid: ['Payment failed'],
});
// → GREEN | AMBER | RED
```

## Liquid Gold siblings

| Repo | Role |
|------|------|
| [aurum-gate](https://github.com/Ormus-Solutions/aurum-gate) | Pattern 2 gates |
| [quicksilver-judge](https://github.com/Ormus-Solutions/quicksilver-judge) | Raven PR pre-filter |
| [gold-assay](https://github.com/Ormus-Solutions/gold-assay) | **You are here** — Vibium assay |
| [molten-cascade](https://github.com/Ormus-Solutions/molten-cascade) | Pattern 4 cascade |
| [karat-filter](https://github.com/Ormus-Solutions/karat-filter) | Pattern 5 filter |
| [liquid-gold](https://github.com/Ormus-Solutions/liquid-gold) | Index |

## Scripts

```bash
npm test
npm run build
```

## License

MIT © 2026 Ormus Solutions
