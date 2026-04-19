// https://github.com/simple-keyboard/simple-keyboard-layouts/wiki/Adding-a-Layout
import { MenuItem, Select, ThemeProvider, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import KeyboardLayouts from 'simple-keyboard-layouts';
import {
  Button,
  getCurrentInput,
  getCurrentOnChange,
  removeCurrentInput,
  selectFieldTheme,
} from 'tycho-storybook';
import {
  COMBINING_DIAERESIS,
  COMBINING_DOT_ABOVE,
  COMBINING_MACRON,
  deadKeyMap,
  KeyboardCustomLayouts,
} from './KeyboardCustomLayout';
import './style.scss';

type Props = {
  onClose: () => void;
  defaultLayout: string;
  closeLabel: string;
};

export default function VirtualKeyboard({
  onClose,
  defaultLayout,
  closeLabel = 'Close',
}: Props) {
  const outerTheme = useTheme();
  const layouts = new KeyboardLayouts();
  const layoutNames = [
    ...Object.keys(layouts.get()),
    ...Object.keys(KeyboardCustomLayouts),
  ].sort((a, b) => a.localeCompare(b));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const [layout, setLayout] = useState<any>();
  const [layoutName, setLayoutName] = useState('default');
  const [selected, setSelected] = useState(defaultLayout);
  const [deadKey, setDeadKey] = useState<string | null>(null);

  const getLayoutByName = (name: string) =>
    layouts.get(name) || KeyboardCustomLayouts[name];

  const handleChangeLayout = (lang: string) => {
    setSelected(lang);
    setLayoutName('default');
    const layoutObject = getLayoutByName(lang);
    setLayout(layoutObject?.layout || layoutObject);
  };

  const handleShift = () => {
    const newLayoutName = layoutName === 'default' ? 'shift' : 'default';
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      handleShift();
      return;
    }

    if (button === '{space}') {
      button = ' ';
    }

    const input = getCurrentInput();
    const onChange = getCurrentOnChange();
    if (input && onChange) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const value = input.value;

      let newValue = value;

      if (button === '{bksp}') {
        newValue = value.slice(0, -1);
        input.setSelectionRange(start - 1, start - 1);
      } else if (deadKey) {
        if (deadKey === '¯') {
          // Macron dead key → works on ANY letter
          newValue =
            value.slice(0, start) +
            button +
            COMBINING_MACRON +
            value.slice(end);
          input.setSelectionRange(start + 2, start + 2);
        } else if (deadKey === '¨') {
          // Diaeresis: works universally
          newValue =
            value.slice(0, start) +
            button +
            COMBINING_DIAERESIS +
            value.slice(end);
          input.setSelectionRange(start + 2, start + 2);
        } else if (deadKey === '˙') {
          // dot above
          newValue =
            value.slice(0, start) +
            button +
            COMBINING_DOT_ABOVE +
            value.slice(end);
          input.setSelectionRange(start + 2, start + 2);
        } else {
          // Normal accent map
          const composed = deadKeyMap[deadKey]?.[button];
          if (composed) {
            newValue = value.slice(0, start) + composed + value.slice(end);
            input.setSelectionRange(start + 1, start + 1);
          } else {
            // no composition found → insert both
            newValue =
              value.slice(0, start) + deadKey + button + value.slice(end);
            input.setSelectionRange(start + 2, start + 2);
          }
        }
        setDeadKey(null);
      } else if (
        deadKeyMap[button] ||
        button === '¯' ||
        button === '¨' ||
        button === '˙'
      ) {
        setDeadKey(button);
        return;
      } else {
        newValue = value.slice(0, start) + button + value.slice(end);
        input.setSelectionRange(start + 1, start + 1);
      }

      input.value = newValue;
      input.focus();
      onChange({ target: input });
    }
  };

  useEffect(() => {
    setLayout(getLayoutByName(defaultLayout)?.layout);
  }, []);

  return (
    <Draggable>
      <div className="keyboard-container">
        <div className="body">
          <Keyboard
            onKeyPress={onKeyPress}
            layoutName={layoutName}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            layout={layout}
          />
        </div>

        <div className="footer">
          <ThemeProvider theme={selectFieldTheme(outerTheme)}>
            <Select
              value={selected}
              fullWidth
              variant="filled"
              color="primary"
              className="select-layout"
              onChange={(e) => {
                handleChangeLayout(e.target.value);
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {layoutNames.map((option, idx) => (
                <MenuItem key={idx.valueOf()} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </ThemeProvider>
          <Button
            onClick={() => {
              removeCurrentInput();
              onClose();
            }}
            text={closeLabel}
            color="danger"
            size="small"
          />
        </div>
      </div>
    </Draggable>
  );
}
