import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'tycho-storybook';
import HelpModal from './HelpModal';

export type HelpAction = {
  title: string;
  desc: string;
  action: () => void;
};

type Props = {
  helpActions?: HelpAction[];
};

export default function HelpButton({ helpActions }: Props) {
  const { t } = useTranslation('header');
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        name="live_help"
        size="medium"
        title={t('tooltip.tutorials')}
        onClick={() => setOpen(true)}
      />
      {open && (
        <HelpModal onClose={() => setOpen(false)} helpActions={helpActions} />
      )}
    </>
  );
}
