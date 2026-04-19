import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'tycho-storybook';
import './styles.scss';

export const LanguageSelectorModes = ['white', 'blue'] as const;
type LanguageSelectorModes = (typeof LanguageSelectorModes)[number];

export const LanguageSelectorSizes = ['large', 'medium', 'small'] as const;
export type LanguageSelectorSizes = (typeof LanguageSelectorSizes)[number];

export const LanguageSelectorColors = [
  'primary',
  'secondary',
  'tertiary',
] as const;
export type LanguageSelectorColors = (typeof LanguageSelectorColors)[number];

export type Props = {
  className?: string;
  color?: LanguageSelectorColors;
  size?: LanguageSelectorSizes;
  /** When true, the trigger shows "Name - code" (e.g. English - en) instead of only the code. */
  showFullLanguageLabel?: boolean;
};

export type AvailableLanguage = {
  value: string;
  name: string;
};

export const AvailableLanguages: AvailableLanguage[] = [
  {
    value: 'en',
    name: 'English',
  },
  {
    value: 'pt-BR',
    name: 'Português-Brasil',
  },
  {
    value: 'it',
    name: 'Italiano',
  },
];

export default function LanguageSelector({
  className,
  color = 'primary',
  size = 'medium',
  showFullLanguageLabel = false,
}: Props) {
  const getClassNames = cx('language-container', className);
  const getClassNamesDropdown = cx('ds-dropdown-button', color, size);

  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<any>();

  const changeLanguageHandler = (lang: any) => {
    setLanguage(lang);
    setOpen(false);
    i18n.changeLanguage(lang.value);
    document.body.click();
  };

  useEffect(() => {
    if (
      i18n.language &&
      AvailableLanguages.filter((t) => t.value === i18n.language).length > 0
    ) {
      setLanguage(
        AvailableLanguages.filter((t) => t.value === i18n.language)[0]
      );
    } else {
      setLanguage(AvailableLanguages[0]);
    }
  }, []);

  if (!language) return null;

  return (
    <div className={getClassNames}>
      <div className="ds-dropdown-container">
        <div className={getClassNamesDropdown} onClick={() => setOpen(!open)}>
          <span className="label">
            {showFullLanguageLabel ? language.name : language.value}
          </span>
          <Icon name="arrow_drop_down" className="icon-arrow" />
        </div>
        {open && (
          <div className="ds-dropdown-list">
            {AvailableLanguages.map((item, idx) => (
              <div
                className="ds-dropdown-itemlist"
                onClick={() => changeLanguageHandler(item)}
                key={idx.valueOf()}
              >
                <span className="label">{item.name}</span>
                <span className="sublabel">{item.value}</span>
                {item.value === language.value && (
                  <Icon name="check" size="x-small" className="icon-check" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
