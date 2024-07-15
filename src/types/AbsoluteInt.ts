export type AbsoluteInt = number & { readonly __brand: unique symbol };

function isAbsoluteInt(n: number): n is AbsoluteInt {
  return Number.isInteger(n) && n >= 0;
}

export function toAbsoluteInt(n: number): AbsoluteInt {
  if (!isAbsoluteInt(n)) {
    throw new Error("Number '" + n +"' is not a positive integer");
  }
  return n as AbsoluteInt;
}
