import { Core } from 'cytoscape';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'tycho-storybook';
import AppPlaceholder from '../AppPlaceholder';
import { Struct } from '../configs/types/Struct';
import TreeViewSearch, {
  SearchCriteria,
} from './TreeViewSearch/TreeViewSearch';
import CytoscapeTreeConverter from './cytoscape/CytoscapeTreeConverter';
import SyntreesCytoscape from './cytoscape/SyntreesCytoscape';
import SentenceUtils from './functions/SentenceUtils';
import './style.scss';

type Props = {
  struct?: Struct;
  expression?: string;
  selector?: string;
  translations?: Record<string, string>;
  wheelSensitivity?: number;
  renderWithInfo?: boolean;
  placeholder?: string;
  cyRef?: React.MutableRefObject<Core | null>;
  onClickExpression?: () => void;
  onExpand?: () => void;
  onReadyCustom?: (thisCy: Core) => void;
};

export default function TreeView({
  struct,
  expression,
  selector = 'canvas-tree',
  translations,
  wheelSensitivity,
  renderWithInfo = false,
  placeholder,
  cyRef,
  onClickExpression,
  onExpand,
  onReadyCustom,
}: Props) {
  const { t } = useTranslation('tree');
  const [cy, setCy] = useState<Core | null>(null);
  const [showInfo, setShowInfo] = useState(renderWithInfo);
  const [invalid, setInvalid] = useState<boolean>();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    syntacticCategory: [],
    posTag: [],
    emptyCategory: [],
    wordValue: [],
  });

  const load = () => {
    setCy(null);
    const element = document.getElementById(selector);
    if (element) element.innerHTML = '';

    if (!struct) return;

    let tree;
    try {
      tree = new CytoscapeTreeConverter().execute(struct, showInfo);
    } catch (e) {
      setInvalid(true);
      return;
    }

    if (!tree) {
      setInvalid(true);
      return;
    }

    SyntreesCytoscape.init({
      selector,
      tree,
      wheelSensitivity,
      onReady: (thisCy) => {
        setCy(thisCy);
        if (cyRef) cyRef.current = thisCy;
        onReadyCustom && onReadyCustom(thisCy);
        renderWithInfo && applyInfo(thisCy, struct, true);
      },
    });
  };

  const downloadPsd = () => {
    if (!expression) return;
    const blob = new Blob([expression], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'sentence.psd');
  };

  const generateImage = () => {
    if (!cy) return;

    const cyContainer = cy.container();
    if (!cyContainer) return;
    html2canvas(cyContainer, {
      backgroundColor: 'white',
    }).then((canvas) => {
      canvas.toBlob(
        (blob) => {
          if (blob === null) return;
          saveAs(blob, 'tree.jpg');
        },
        'image/jpeg',
        1.0
      );
    });
  };

  const reset = () => {
    if (cy) {
      setTimeout(() => {
        cy.fit();
        cy.center();
      }, 200);
    }
  };

  const applyInfo = (thisCy: Core, struct: Struct, extraInfo: boolean) => {
    struct.tokens.forEach((token) => {
      if (!token.ec) {
        const leafId = token.p?.toString();
        const converter = new CytoscapeTreeConverter();
        converter['extraInfo'] = extraInfo;
        const newLabel = converter.getLabelLeaf(token);
        thisCy.$id(leafId).data('label', newLabel);
      }
    });
  };

  const toggleInfo = () => {
    if (!cy || !struct) return;
    const newVal = !showInfo;
    setShowInfo(newVal);
    applyInfo(cy, struct, newVal);
  };

  const openSearchModal = () => {
    setShowSearchModal(true);
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
  };

  useEffect(() => {
    setInvalid(undefined);
    load();
  }, [struct]);

  if (!struct) {
    return (
      <AppPlaceholder
        text={placeholder || t('placeholder.sentence.notparsed')}
      />
    );
  }

  return (
    <div className="tree-view-container">
      {invalid && (
        <div className="tree-placeholder-overlay">
          <AppPlaceholder
            text={placeholder || t('placeholder.sentence.notparsed')}
          />
        </div>
      )}
      <div className="floating-buttons">
        {cy &&
          getButtons(
            generateImage,
            reset,
            onClickExpression || downloadPsd,
            toggleInfo,
            onExpand,
            expression,
            openSearchModal
          )
            .filter((btn) => btn.condition)
            .map((btn, i) => {
              return (
                <IconButton
                  key={i}
                  name={btn.icon}
                  title={t(btn.title)}
                  onClick={btn.onClick}
                  size="small"
                  mode="ghost"
                />
              );
            })}
      </div>

      {showSearchModal && cy && (
        <TreeViewSearch
          struct={struct}
          cy={cy}
          onClose={closeSearchModal}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
        />
      )}

      <div id={selector} className="canvas-tree" />

      {showInfo && (
        <div className="info">
          <span>{SentenceUtils.getAsText(struct)}</span>
          {translations &&
            Object.entries(translations).map(([k, v]) => (
              <div className="translation" key={k}>
                <b>{k}:</b>
                <span>{v}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

type ViewButton = {
  condition: boolean;
  title: string;
  onClick: () => void;
  icon: string;
};

const getButtons = (
  generateImage: () => void,
  reset: () => void,
  downloadPsd: () => void,
  toggleInfo: () => void,
  onExpand?: () => void,
  expression?: string,
  openSearchModal?: () => void
): ViewButton[] => [
  {
    condition: true,
    title: 'button.download.tree',
    onClick: generateImage,
    icon: 'download',
  },
  {
    condition: true,
    title: 'button.recenter.tree',
    onClick: reset,
    icon: 'fullscreen',
  },
  {
    condition: !!expression,
    title: 'button.download.penn',
    onClick: downloadPsd,
    icon: 'graph_4',
  },
  {
    condition: !!onExpand,
    title: 'button.expand.tree',
    onClick: onExpand || (() => {}),
    icon: 'open_in_full',
  },
  {
    condition: true,
    title: 'button.info',
    onClick: toggleInfo,
    icon: 'info',
  },
  {
    condition: true,
    title: 'button.search',
    onClick: openSearchModal || (() => {}),
    icon: 'search',
  },
];
