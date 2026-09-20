import { assay, assayFlow } from './index.js';

console.log('=== Gold Assay — Vibium UI proof scorer ===\n');

const green = assay({
  frameId: 'checkout-success',
  ocrText: 'Order confirmed. Thank you for your purchase. Confirmation #A-1042',
  domSummary: 'main > heading:Order confirmed; status:success; button:Continue shopping',
  expect: ['Order confirmed', 'Confirmation'],
  forbid: ['Payment failed', '404'],
});
console.log(green);

const red = assay({
  frameId: 'checkout-fail',
  ocrText: 'Payment failed. Please try again.',
  domSummary: 'alert:error Payment failed',
  expect: ['Order confirmed'],
  forbid: ['Payment failed'],
});
console.log(red);

console.log(
  'Flow:',
  assayFlow([
    {
      ocrText: 'Cart (2 items)',
      domSummary: 'list:cart',
      expect: ['Cart'],
    },
    {
      ocrText: 'Order confirmed',
      domSummary: 'status:success',
      expect: ['Order confirmed'],
    },
  ]),
);
