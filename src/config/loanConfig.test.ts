import { describe, it, expect } from 'vitest';
import { calculateLoanRepayment, formatRandSpace } from './loanConfig';

describe('Accurate Loan Calculator Engine', () => {
  it('calculates mandatory reference case: R10 000 over 12 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(10000, 12);
    expect(res.monthlyRepayment.toFixed(2)).toBe('887.32');
    expect(res.totalInterest.toFixed(2)).toBe('647.83');
    expect(res.totalRepayment.toFixed(2)).toBe('10647.83');
    expect(formatRandSpace(res.monthlyRepayment, true)).toBe('R 887.32');
    expect(formatRandSpace(res.totalInterest, true)).toBe('R 647.83');
    expect(formatRandSpace(res.totalRepayment, true)).toBe('R 10 647.83');
  });

  it('calculates reference case: R5 000 over 12 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 12);
    expect(res.monthlyRepayment.toFixed(2)).toBe('443.66');
    expect(res.totalInterest.toFixed(2)).toBe('323.91');
    expect(res.totalRepayment.toFixed(2)).toBe('5323.91');
    expect(formatRandSpace(res.monthlyRepayment, true)).toBe('R 443.66');
    expect(formatRandSpace(res.totalInterest, true)).toBe('R 323.91');
  });

  it('calculates reference case: R5 000 over 24 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 24);
    expect(res.monthlyRepayment.toFixed(2)).toBe('234.78');
    expect(res.totalInterest.toFixed(2)).toBe('634.82');
    expect(res.totalRepayment.toFixed(2)).toBe('5634.82');
    expect(formatRandSpace(res.monthlyRepayment, true)).toBe('R 234.78');
    expect(formatRandSpace(res.totalInterest, true)).toBe('R 634.82');
    expect(formatRandSpace(res.totalRepayment, true)).toBe('R 5 634.82');
  });

  it('calculates reference case: R5 000 over 36 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 36);
    expect(res.monthlyRepayment.toFixed(2)).toBe('165.48');
    expect(res.totalInterest.toFixed(2)).toBe('957.11');
  });

  it('calculates reference case: R5 000 over 48 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 48);
    expect(res.monthlyRepayment.toFixed(2)).toBe('131.06');
    expect(res.totalInterest.toFixed(2)).toBe('1290.70');
  });

  it('calculates reference case: R5 000 over 60 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 60);
    expect(res.monthlyRepayment.toFixed(2)).toBe('110.59');
    expect(res.totalInterest.toFixed(2)).toBe('1635.50');
  });

  it('calculates reference case: R5 000 over 72 months at 11.75% p.a.', () => {
    const res = calculateLoanRepayment(5000, 72);
    expect(res.monthlyRepayment.toFixed(2)).toBe('97.10');
    expect(res.totalInterest.toFixed(2)).toBe('1991.35');
  });
});
