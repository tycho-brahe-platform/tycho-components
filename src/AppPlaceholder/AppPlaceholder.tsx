import { Icon } from "tycho-storybook";
import "./style.scss";

type Props = {
  icon?: string;
  text?: string;
  desc?: string;
  children?: React.ReactNode;
  useMarginTop?: boolean;
  onClick?: () => void;
};

export default function AppPlaceholder({
  text,
  desc,
  children,
  icon = "contract_delete",
  useMarginTop = false,
  onClick,
}: Props) {
  return (
    <div
      className={`ds-placeholder ${useMarginTop ? "with-margin-top" : ""}`}
      onClick={() => onClick && onClick()}
      onKeyDown={() => onClick && onClick()}
    >
      <Icon name={icon} weight="heavy" size="x-large" filled />
      {text && <span className="title">{text}</span>}
      {desc && <span className="desc">{desc}</span>}
      {children && children}
    </div>
  );
}
