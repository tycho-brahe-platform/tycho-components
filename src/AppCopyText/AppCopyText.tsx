import { useState } from "react";
import cx from "classnames";
import "./styles.scss";
import { Icon, Tooltip } from "tycho-storybook";
import { useTranslation } from "react-i18next";

export const TitlePositions = ["top", "right"] as const;
type TitlePosition = (typeof TitlePositions)[number];

export type Props = {
  className?: string;
  title?: string;
  content: string;
  titlePosition?: TitlePosition;
};

export default function AppCopyText({
  className,
  title,
  content,
  titlePosition = "right",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation("common");

  const getClassNames = cx("ds-copy-text", className, {
    "title-top": titlePosition === "top" && title,
    "title-right": titlePosition === "right" && title,
    "no-title": !title,
  });

  const handleClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  const tooltipTitle = copied ? t("tooltip.copied") : t("tooltip.copy");
  const iconName = copied ? "check" : "content_copy";
  const iconFilled = isHovered && !copied;

  const contentElement = (
    <div
      className={getClassNames}
      onClick={handleClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && <span className="ds-copy-text__title">{title}</span>}
      {title && titlePosition === "right" && (
        <span className="ds-copy-text__separator">|</span>
      )}
      <div className="group-content">
        <span className="ds-copy-text__content">{content}</span>
        <Icon
          name={iconName}
          size="small"
          className="ds-copy-text__icon"
          filled={iconFilled}
        />
      </div>
    </div>
  );

  return (
    <Tooltip
      title={tooltipTitle}
      placement="top"
      mode="simple"
      triggerOpen={copied ? true : undefined}
    >
      {contentElement}
    </Tooltip>
  );
}
