import type { Preview } from '@storybook/react';
import { CommonProvider } from '../src/configs/CommonContext';

// Prevent API interceptors from redirecting on 401/403 in Storybook
if (typeof window !== 'undefined') {
  (window as Window & { __STORYBOOK__?: boolean }).__STORYBOOK__ = true;
}
import commonLocalization from '../src/configs/Localization';
import AppToast from '../src/AppToast';
import '../src/styles/main.scss';
import 'tycho-storybook/dist/styles/main';
import './preview.css';

commonLocalization();

// Suppress defaultProps warning from react-easy-edit library
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes(
        'Support for defaultProps will be removed from function components'
      )
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <CommonProvider>
        <Story />
        <AppToast />
      </CommonProvider>
    ),
  ],
};

export default preview;
