import { useTranslation } from 'react-i18next';
import { Icon, IconButton, Tag } from 'tycho-storybook';
import './style.scss';

type Props = {
  label: string;
  value: string;
  badges: string[];
  onValueChange: (value: string) => void;
  onAddBadge: () => void;
  onRemoveBadge: (index: number) => void;
};

export default function TreeViewSearchField({
  label,
  value,
  badges,
  onValueChange,
  onAddBadge,
  onRemoveBadge,
}: Props) {
  const { t } = useTranslation('tree');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddBadge();
    }
  };

  const renderTag = (value: string, idx: number) => {
    return (
      <>
        <span>{value}</span>
        <Icon
          name="close"
          size="small"
          onClick={(e) => {
            onRemoveBadge(idx);
            e.stopPropagation();
          }}
        />
      </>
    );
  };

  return (
    <div className="search-field">
      <label>{label}</label>
      <div className="input-with-button">
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder={t('common:generic.placeholder')}
        />
        <IconButton onClick={onAddBadge} name="add" size="medium" />
      </div>
      <div className="badges">
        {badges.map((badge, index) => (
          <Tag text={renderTag(badge, index)} key={index} />
        ))}
      </div>
    </div>
  );
}
