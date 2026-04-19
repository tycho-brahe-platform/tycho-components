import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { BaseTexts } from './localization/BaseTexts';
import { CommonTexts } from './localization/CommonTexts';
import { HeaderTexts } from './localization/HeaderTexts';
import { HelpTexts } from './localization/HelpTexts';
import { TreeTexts } from './localization/TreeTexts';
import { UploadTexts } from './localization/UploadTexts';

export const commonResources = {
  en: {
    base: BaseTexts.en,
    common: CommonTexts.en,
    header: HeaderTexts.en,
    tree: TreeTexts.en,
    upload: UploadTexts.en,
    help: HelpTexts.en,
  },
  'pt-BR': {
    base: BaseTexts['pt-BR'],
    common: CommonTexts['pt-BR'],
    header: HeaderTexts['pt-BR'],
    tree: TreeTexts['pt-BR'],
    upload: UploadTexts['pt-BR'],
    help: HelpTexts['pt-BR'],
  },
  it: {
    base: BaseTexts.it,
    common: CommonTexts.it,
    header: HeaderTexts.it,
    tree: TreeTexts.it,
    upload: UploadTexts.it,
    help: HelpTexts.it,
  },
};

export default function commonLocalization() {
  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources: commonResources,
      fallbackLng: 'en',
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
    });
}
