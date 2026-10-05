import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

expect.extend(toHaveNoViolations);

// RTL's auto-cleanup only self-registers when it detects Jest-style globals;
// since this project doesn't enable vitest's `globals` option, register it
// explicitly so each test starts from an empty DOM.
afterEach(cleanup);

// jsdom implements neither of these, but Radix's size-measuring and
// pointer-capture logic (Slider, Select, and other primitives that read
// element size or claim the pointer) call them unconditionally.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= ResizeObserverStub;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};
