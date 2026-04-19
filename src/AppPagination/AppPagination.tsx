import { MenuItem, MenuProps as MuiMenuProps, Select } from '@mui/material';
import { PaginationState } from '@tanstack/react-table';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IconButton } from 'tycho-storybook';
import './styles.scss';

type Props<TData> = {
  totalElements: number;
  pagination: PaginationState;
  setPagination: (p: PaginationState) => void;
  hideItensPage?: boolean;
  hidePageTotal?: boolean;
  numItens?: number[];
  size?: 'medium' | 'small';
};

export default function AppPagination<TData>({
  totalElements,
  pagination,
  setPagination,
  hideItensPage,
  hidePageTotal,
  numItens = [10, 25, 50],
  size = 'medium',
}: Props<TData>) {
  const { t } = useTranslation('common');

  const numPages = Math.ceil(totalElements / pagination.pageSize);
  const currentPage = pagination.pageIndex + 1;

  const getFirstElementNumber = () =>
    pagination.pageIndex * pagination.pageSize + 1;

  const getLastElementNumber = () =>
    Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalElements);

  const setPageSize = (p: number) => {
    setPagination({ ...pagination, pageSize: p });
  };

  const setPageIndex = (p: number) => {
    setPagination({ ...pagination, pageIndex: p });
  };

  return (
    <div
      className={classNames('app-table-pagination', {
        small: size === 'small',
      })}
    >
      {!hideItensPage && (
        <div className="itens-page">
          <span>{t('table.label.rows-page')}</span>
          <Select
            value={pagination.pageSize}
            onChange={(e) => setPageSize(e.target.value as number)}
            MenuProps={menuProps}
            size={size === 'small' ? 'small' : 'medium'}
          >
            {numItens.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
      <div className="itens-total">
        <span>
          <Trans
            t={t}
            i18nKey="table.label.items"
            values={{
              first: getFirstElementNumber(),
              last: getLastElementNumber(),
              total: totalElements,
            }}
          />
        </span>
      </div>
      {!hidePageTotal && (
        <div className="pages-total">
          <Select
            value={currentPage}
            onChange={(e) => setPageIndex((e.target.value as number) - 1)}
            MenuProps={menuProps}
            size={size === 'small' ? 'small' : 'medium'}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          <span>
            <Trans
              t={t}
              i18nKey="table.label.pages"
              values={{ value: numPages }}
            />
          </span>
        </div>
      )}
      <div className="pages-navigation">
        <IconButton
          size={size}
          mode="tonal"
          onClick={() => setPageIndex(pagination.pageIndex - 1)}
          disabled={pagination.pageIndex === 0}
          name="chevron_backward"
        />

        <IconButton
          size={size}
          mode="tonal"
          onClick={() => setPageIndex(pagination.pageIndex + 1)}
          disabled={pagination.pageIndex >= numPages - 1}
          name="chevron_forward"
        />
      </div>
    </div>
  );
}

const menuProps: Partial<MuiMenuProps> = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error -- PopperProps is not typed but works at runtime
  PopperProps: {
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
      {
        name: 'offset',
        options: {
          offset: [0, -4],
        },
      },
    ],
  },
};
