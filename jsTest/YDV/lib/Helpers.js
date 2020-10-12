import BigNumber from 'bignumber.js/bignumber';
import { INTEGERS } from './constants.js';

export function plus(a, b) {
  return new BigNumber(a).plus(BigNumber(b)).toFixed(0);
}

export function minus(a, b) {
  return new BigNumber(a).minus(BigNumber(b)).toFixed(0);
}

export function times(a, b) {
  return new BigNumber(a).times(BigNumber(b)).toFixed(0);
}

export function div(a, b) {
  return new BigNumber(a).div(BigNumber(b)).toFixed(0);
}

export function stringToDecimal(s) {
  return new BigNumber(s).div(INTEGERS.INTEREST_RATE_BASE);
}

export function decimalToString(d) {
  return new BigNumber(d).times(INTEGERS.INTEREST_RATE_BASE).toFixed(0);
}

export function toString(input) {
  return new BigNumber(input).toFixed(0);
}

export function integerToValue(i) {
  return {
    sign: i.isGreaterThan(0),
    value: i.abs().toFixed(0),
  };
}

export function valueToInteger(
  { value, sign },
) {
  let result = new BigNumber(value);
  if (!result.isZero() && !sign) {
    result = result.times(-1);
  }
  return result;
}

export function coefficientsToString(
  coefficients,
) {
  let m = new BigNumber(1);
  let result = new BigNumber(0);
  for (let i = 0; i < coefficients.length; i += 1) {
    result = result.plus(m.times(coefficients[i]));
    m = m.times(256);
  }
  return result.toFixed(0);
}

export function toNumber(input) {
  return new BigNumber(input).toNumber();
}


function partial(
  target,
  numerator,
  denominator,
){
  return target.times(numerator).div(denominator).integerValue(BigNumber.ROUND_DOWN);
}

export function etherExp(num) { return etherMantissa(num, 1e18) }
export function etherDouble(num) { return etherMantissa(num, 1e36) }
export function etherMantissa(num, scale = 1e18) {
  if (num < 0)
    return new BigNumber(2).pow(256).plus(num).toFixed();
  return new BigNumber(num).times(scale).toFixed();
}

export function etherUnsigned(num) {
  return new BigNumber(num).toFixed();
}
