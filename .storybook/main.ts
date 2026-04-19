import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
            @use 'tycho-storybook/dist/styles/base/typographs' as *;
          `,
            includePaths: [
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'node_modules'),
              path.resolve(
                __dirname,
                'node_modules/tycho-storybook/dist/styles'
              ),
            ],
          },
        },
      },
    });
  },
};
export default config;
