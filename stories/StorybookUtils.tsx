import { useArgs } from '@storybook/preview-api';
import type { StoryFn } from '@storybook/react';

const secondaryBackgroundColor = '#185ABD';

const withDynamicDocsBackground = (Story: StoryFn) => {
  const [{ color }] = useArgs();

  const backgroundColor = color === 'white' ? '#185ABD' : '#FFFFFF';
  const docsStoryElement = document.querySelector('.docs-story');
  if (docsStoryElement) {
    docsStoryElement.setAttribute(
      'style',
      `background-color: ${backgroundColor || 'defaultBackgroundColor'}`
    );
  }

  return <Story />;
};

const withSecondaryDocsBackground = (Story: StoryFn) => {
  const docsStoryElement = document.querySelector('.docs-story');
  if (docsStoryElement) {
    docsStoryElement.setAttribute(
      'style',
      `background-color: ${
        secondaryBackgroundColor || 'defaultBackgroundColor'
      }`
    );
  }

  return <Story />;
};

const StorybookUtils = {
  withDynamicDocsBackground,
  withSecondaryDocsBackground,
};

export default StorybookUtils;
