import logo from './logo.png';

type App = {
  code: string;
  icon?: string;
  image?: string;
  link?: string;
  disabled?: boolean;
};

export const AvailableApps: App[] = [
  {
    code: 'ud-editor',
    icon: 'lock',
    link: 'https://udeditor.netlify.app',
  },
  {
    code: 'psd-reindexer',
    icon: '123',
    link: 'https://psdreindexer.netlify.app',
  },
  {
    code: 'cs-analyzer',
    icon: '123',
    link: 'https://csanalyzer.netlify.app',
  },
];

export const QuickAccessApps: App[] = [
  {
    code: 'platform',
    image: logo,
    link: 'https://tychoplatform.com/',
  },
];

export default App;
