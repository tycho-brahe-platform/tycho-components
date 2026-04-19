import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'tycho-storybook';
import { ButtonDSSizes } from 'tycho-storybook/dist/Button/Button';

type Props = {
  text: string;
  size?: ButtonDSSizes;
};

export default function AppClipboard({ text, size = 'x-small' }: Props) {
  const { t } = useTranslation('common');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
      });
  };

  const tooltipTitle = copied ? t('tooltip.copied') : t('tooltip.copy');

  return (
    <IconButton
      name="content_copy"
      title={tooltipTitle}
      onClick={handleCopy}
      size={size}
    />
  );
}
