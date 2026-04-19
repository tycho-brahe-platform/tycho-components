export type KeyboardLayout = {
  layout: {
    default: string[];
    shift: string[];
  };
  display: Record<string, string>;
};

export const COMBINING_MACRON = '\u0304';
export const COMBINING_DIAERESIS = '\u0308';
export const COMBINING_DOT_ABOVE = '\u0307';

export const KeyboardCustomLayouts: Record<string, KeyboardLayout> = {
  kadiwéu: {
    layout: {
      default: [
        '1 2 3 4 5 6 7 8 9 0',
        'q w e r t y u i o p',
        'a s d f g h j k l',
        'z x c v b n m ǥ',
        '{shift} {space} {bksp}',
      ],
      shift: [
        '! @ # $ % ^ & * ( )',
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        'Z X C V B N M Ǥ',
        '{shift} {space} {bksp}',
      ],
    },
    display: {
      '{bksp}': '⌫',
      '{shift}': '⇧',
      '{space}': '␣',
    },
  },
  linklado: {
    layout: {
      default: [
        '1 2 3 4 5 6 7 8 9 0',
        'q w e r t y u ᵾ i ɨ o p',
        "a s d f g h j k l ' ~",
        'z x c v b n ñ m',
        '{shift} {space} {bksp}',
      ],
      shift: [
        '! ¯ ¨ ´ ` ^ ˙ * ( )',
        'Q W E R T Y U Ʉ I Ɨ O P',
        'A S D F G H J K L',
        'Z X C V B N Ñ M',
        '{shift} {space} {bksp}',
      ],
    },
    display: {
      '{bksp}': '⌫',
      '{shift}': '⇧',
      '{space}': '␣',
    },
  },
};

export const deadKeyMap: Record<string, Record<string, string>> = {
  '~': { a: 'ã', o: 'õ', A: 'Ã', O: 'Õ' },
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' },
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ć' },
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' },
  '"': { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', y: 'ÿ' },
};
