import { describe, it, expect } from 'vitest';
import { assay, assayFlow } from './index.js';

describe('gold-assay', () => {
  it('marks GREEN when expects hit and forbids miss', () => {
    const r = assay({
      ocrText: 'Welcome back, Diego. Dashboard loaded.',
      domSummary: 'heading:Dashboard; nav:Home',
      expect: ['Dashboard', 'Welcome'],
      forbid: ['Error'],
    });
    expect(r.verdict).toBe('GREEN');
    expect(r.hits.length).toBe(2);
  });

  it('marks RED on forbidden signals', () => {
    const r = assay({
      ocrText: '404 Not Found',
      domSummary: 'heading:404',
      expect: ['Dashboard'],
      forbid: ['404'],
    });
    expect(r.verdict).toBe('RED');
    expect(r.violations).toContain('404');
  });

  it('supports regex-ish expect needles', () => {
    const r = assay({
      ocrText: 'Invoice INV-9912 ready',
      domSummary: 'doc',
      expect: ['/INV-\\d+/'],
    });
    expect(r.hits.length).toBe(1);
  });

  it('assayFlow fails closed on any RED step', () => {
    const { overall } = assayFlow([
      { ocrText: 'ok', domSummary: 'ok', expect: ['ok'] },
      { ocrText: 'boom error', domSummary: 'err', expect: ['ok'], forbid: ['error'] },
    ]);
    expect(overall).toBe('RED');
  });
});
