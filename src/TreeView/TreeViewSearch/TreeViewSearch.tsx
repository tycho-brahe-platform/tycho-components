import { Core } from 'cytoscape';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppModal from '../../AppModal';
import { Struct } from '../../configs/types/Struct';
import TreeViewSearchField from './TreeViewSearchField';
import './style.scss';

export type SearchCriteria = {
  syntacticCategory: string[];
  posTag: string[];
  emptyCategory: string[];
  wordValue: string[];
};

type Props = {
  struct: Struct;
  cy: Core;
  onClose: () => void;
  searchCriteria: SearchCriteria;
  setSearchCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
};

export default function TreeViewSearch({
  struct,
  cy,
  onClose,
  searchCriteria,
  setSearchCriteria,
}: Props) {
  const { t } = useTranslation('tree');
  const [inputValues, setInputValues] = useState<{
    syntacticCategory: string;
    posTag: string;
    emptyCategory: string;
    wordValue: string;
  }>({
    syntacticCategory: '',
    posTag: '',
    emptyCategory: '',
    wordValue: '',
  });

  const addBadge = (
    type: 'syntacticCategory' | 'posTag' | 'emptyCategory' | 'wordValue'
  ) => {
    const value = inputValues[type].trim();
    if (!value) return;

    setSearchCriteria((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));

    setInputValues((prev) => ({
      ...prev,
      [type]: '',
    }));
  };

  const removeBadge = (
    type: 'syntacticCategory' | 'posTag' | 'emptyCategory' | 'wordValue',
    index: number
  ) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const performSearch = () => {
    if (!cy || !struct) return;

    // Remove previous highlights
    cy.nodes().removeClass('highlight');

    cy.nodes().forEach((node) => {
      const data = node.data();

      // Check syntactic category (chunks)
      if (data.chunk && searchCriteria.syntacticCategory.length > 0) {
        const chunkCategory = data.chunk.t || '';
        if (
          searchCriteria.syntacticCategory.some(
            (cat) => chunkCategory.toLowerCase() === cat.toLowerCase()
          )
        ) {
          node.addClass('highlight');
        }
      }

      // Check POS tag (tokens)
      if (data.token && searchCriteria.posTag.length > 0) {
        const posTag = data.token.t || '';
        if (
          searchCriteria.posTag.some(
            (tag) => posTag.toLowerCase() === tag.toLowerCase()
          )
        ) {
          node.addClass('highlight');
        }
      }

      // Check empty category
      if (data.token && searchCriteria.emptyCategory.length > 0) {
        const isEmpty = data.token.ec === true;
        const emptyValue = data.token.v;
        if (
          searchCriteria.emptyCategory.some((ec) => {
            return (
              (emptyValue.toLowerCase() === ec.toLowerCase() ||
                emptyValue.toLowerCase() === ec.toLowerCase()) &&
              isEmpty
            );
          })
        ) {
          node.addClass('highlight');
        }
      }

      // Check word value
      if (data.token && searchCriteria.wordValue.length > 0) {
        const wordValue = data.token.v || '';
        if (
          searchCriteria.wordValue.some(
            (val) => wordValue.toLowerCase() === val.toLowerCase()
          )
        ) {
          node.addClass('highlight');
        }
      }
    });

    onClose();
  };

  const searchFields = [
    {
      key: 'syntacticCategory' as const,
      label: t('label.syntactic.category'),
    },
    {
      key: 'posTag' as const,
      label: t('label.pos.tag'),
    },
    {
      key: 'emptyCategory' as const,
      label: t('label.empty.category'),
    },
    {
      key: 'wordValue' as const,
      label: t('label.word.value'),
    },
  ];

  return (
    <AppModal
      title={t('button.search') || 'Search Tree'}
      close={onClose}
      className="tree-search-modal"
      confirm={performSearch}
      disableConfirm={
        searchCriteria.syntacticCategory.length === 0 &&
        searchCriteria.posTag.length === 0 &&
        searchCriteria.emptyCategory.length === 0 &&
        searchCriteria.wordValue.length === 0
      }
    >
      {searchFields.map((field) => (
        <TreeViewSearchField
          key={field.key}
          label={field.label}
          value={inputValues[field.key]}
          badges={searchCriteria[field.key]}
          onValueChange={(value) =>
            setInputValues((prev) => ({
              ...prev,
              [field.key]: value,
            }))
          }
          onAddBadge={() => addBadge(field.key)}
          onRemoveBadge={(index) => removeBadge(field.key, index)}
        />
      ))}
    </AppModal>
  );
}
