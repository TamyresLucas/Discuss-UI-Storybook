import 'vitest';

interface AxeMatchers {
  /** Asserts an axe-core scan (`await axe(container)`) found no violations. */
  toHaveNoViolations(): void;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
