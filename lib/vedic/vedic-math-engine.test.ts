import { test } from 'node:test';
import assert from 'node:assert';
import { digitalRoot, reduceToSingleDigit } from './vedic-math-engine';

test('digitalRoot', async (t) => {
  await t.test('returns 0 for 0', () => {
    assert.strictEqual(digitalRoot(0), 0);
  });

  await t.test('returns single digit for 1-8', () => {
    assert.strictEqual(digitalRoot(1), 1);
    assert.strictEqual(digitalRoot(5), 5);
    assert.strictEqual(digitalRoot(8), 8);
  });

  await t.test('returns 9 for multiples of 9', () => {
    assert.strictEqual(digitalRoot(9), 9);
    assert.strictEqual(digitalRoot(18), 9);
    assert.strictEqual(digitalRoot(27), 9);
  });

  await t.test('calculates digital root for multi-digit numbers', () => {
    assert.strictEqual(digitalRoot(123), 6); // 1+2+3=6
    assert.strictEqual(digitalRoot(456), 6); // 4+5+6=15, 1+5=6 (456 % 9 = 6)
  });

  await t.test('handles negative numbers by taking absolute value', () => {
    assert.strictEqual(digitalRoot(-123), 6);
    assert.strictEqual(digitalRoot(-9), 9);
  });
});

test('reduceToSingleDigit', async (t) => {
  await t.test('returns 0 for 0', () => {
    assert.strictEqual(reduceToSingleDigit(0), 0);
  });

  await t.test('returns single digits as they are', () => {
    assert.strictEqual(reduceToSingleDigit(1), 1);
    assert.strictEqual(reduceToSingleDigit(9), 9);
  });

  await t.test('reduces multi-digit numbers to a single digit', () => {
    assert.strictEqual(reduceToSingleDigit(99), 9); // 9+9=18, 1+8=9
    assert.strictEqual(reduceToSingleDigit(123), 6);
    assert.strictEqual(reduceToSingleDigit(39), 3); // 3+9=12, 1+2=3
  });

  await t.test('handles negative numbers', () => {
    assert.strictEqual(reduceToSingleDigit(-99), 9);
  });

  await t.test('rounds floating point numbers before reduction', () => {
    assert.strictEqual(reduceToSingleDigit(12.6), 4); // round(12.6) = 13, 1+3=4
    assert.strictEqual(reduceToSingleDigit(12.4), 3); // round(12.4) = 12, 1+2=3
  });
});
