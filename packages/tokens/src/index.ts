import './tokens.css';

/**
 * Importing this package (`import '@discuss-ds/tokens'`) applies the CSS custom
 * property layer to whatever document it runs in. There is no JS token API by
 * design — components and consumers read tokens through CSS var() / Tailwind
 * theme keys, never through imported JS objects. See ../../../.context/DESIGN_TOKENS.md.
 */
export const TOKENS_CSS_IMPORTED = true;
