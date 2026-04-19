import cx from 'classnames';
import { DropdownMenu } from 'tycho-storybook';
import { DropdownMenuItem } from 'tycho-storybook/dist/DropdownMenu/DropdownMenu';
import './style.scss';

type Props = {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  extraHeaderActions?: React.ReactNode;
  footer?: React.ReactNode;
  options?: DropdownMenuItem[];
  className?: string;
  onClick?: () => void;
};

export default function AppCard({
  title,
  children,
  extraHeaderActions,
  footer,
  options,
  className,
  onClick,
}: Props) {
  return (
    <div className={cx('ds-app-card', className)} onClick={onClick}>
      {title && (
        <div className="header">
          <div className="title">{title}</div>
          {extraHeaderActions && (
            <div className="extra-header-actions">{extraHeaderActions}</div>
          )}
          {options && <DropdownMenu list={options} />}
        </div>
      )}
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}
