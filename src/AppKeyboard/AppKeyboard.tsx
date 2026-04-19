import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'tycho-storybook';
import { ButtonDSModes } from 'tycho-storybook/dist/Button/Button';
import VirtualKeyboard from '../VirtualKeyboard';

type Props = {
  buttonMode?: ButtonDSModes;
  keyboardLayout?: string;
};

export default function AppKeyboard({
  buttonMode = 'filled',
  keyboardLayout,
}: Props) {
  const { t } = useTranslation('header');

  const [openKeyboard, setOpenKeyboard] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpenKeyboard(!openKeyboard)}
        name="keyboard"
        size="medium"
        title={t('tooltip.keyboard')}
        mode={buttonMode}
      />
      {openKeyboard && (
        <VirtualKeyboard
          onClose={() => setOpenKeyboard(false)}
          closeLabel={t('button.close')}
          defaultLayout={keyboardLayout || 'english'}
        />
      )}
    </>
  );
}
