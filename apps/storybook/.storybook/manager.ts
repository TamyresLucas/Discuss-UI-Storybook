import { mountVercelToolbar } from '@vercel/toolbar';

// Vercel Toolbar powers comments on the deployed Storybook. The manager is the
// top-level page (the stories render in an iframe), so mount it here, and only
// on deployed hosts so local `pnpm storybook` never shows it.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
if (!isLocal) {
  mountVercelToolbar();
}
