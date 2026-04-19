import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'tycho-storybook';
import LanguageSelector from '../LanguageSelector';
import VirtualKeyboard from '../VirtualKeyboard';
import HeaderApps from './HeaderApps';
import HelpButton from './HelpButton';
import { HelpAction } from './HelpButton/HelpButton';
import './styles.scss';

type Props = {
  tool: string;
  hideKeyboard?: boolean;
  parser?: boolean;
  customHeader?: React.ReactNode;
  keyboardLayout?: string;
  navigateHome?: () => void;
  helpActions?: HelpAction[];
};

export default function Header({
  tool,
  hideKeyboard,
  customHeader,
  keyboardLayout,
  navigateHome,
  helpActions,
}: Props) {
  const { t } = useTranslation('header');

  const [openKeyboard, setOpenKeyboard] = useState(false);

  const homeTextsClass = cx('app-title', {
    pointer: navigateHome !== undefined,
  });

  return (
    <div className="ds-header">
      <div className="header-left">
        <HeaderApps />
        <div
          className={homeTextsClass}
          onClick={() => navigateHome && navigateHome()}
        >
          <span className="title">{t('label.platform')}</span>
          <span className="subtitle">{tool}</span>
        </div>
      </div>

      <div className="header-center">{customHeader && customHeader}</div>

      <div className="header-right">
        {!hideKeyboard && (
          <IconButton
            onClick={() => setOpenKeyboard(!openKeyboard)}
            name="keyboard"
            size="medium"
            title={t('tooltip.keyboard')}
          />
        )}
        <HelpButton helpActions={helpActions} />

        <LanguageSelector />
      </div>

      {openKeyboard && (
        <VirtualKeyboard
          onClose={() => setOpenKeyboard(false)}
          closeLabel={t('button.close')}
          defaultLayout={keyboardLayout || 'english'}
        />
      )}
    </div>
  );
}
