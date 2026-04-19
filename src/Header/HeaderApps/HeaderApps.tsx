import { Drawer } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, IconButton } from 'tycho-storybook';
import App, { AvailableApps, QuickAccessApps } from '../../configs/types/App';
import './style.scss';

export default function HeaderApps() {
  const { t } = useTranslation('header');

  const [open, setOpen] = useState(false);

  const goto = (app: App, blank: boolean) => {
    const url = app.link || `/${app.code}`;
    if (blank) {
      window.open(url, '_blank');
    } else {
      location.href = url;
    }
  };

  const renderItem = (item: App, idx: number) => {
    return (
      <div className="item" key={idx.valueOf()} title={t(`${item.code}.desc`)}>
        {item.icon && (
          <div className="icon">
            <Icon name={item.icon} />
          </div>
        )}
        {item.image && <img src={item.image} />}
        <div className="texts">
          <span className="label">{t(`${item.code}.name`)}</span>
          <span className="sublabel">{t(`${item.code}.desc`)}</span>
        </div>
        <div className="options">
          <Button
            text={t('common:button.open')}
            size="x-small"
            mode="tonal"
            onClick={() => goto(item, false)}
          />
          <IconButton
            name="open_in_new"
            size="x-small"
            className="icon-open"
            mode="tonal"
            onClick={() => goto(item, true)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="header-apps-container">
      <IconButton
        name="apps"
        className="icon-apps"
        size="large"
        onClick={() => setOpen(!open)}
        filledIcon
      />
      {open && (
        <Drawer
          anchor="left"
          open
          onClose={() => setOpen(false)}
          className="offcanvas-apps"
        >
          <div className="header">
            <span className="label">{t('header:label.platform')}</span>
            <IconButton
              name="close"
              size="x-small"
              mode="ghost"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="body">
            <div className="title">{t('label.tools')}</div>
            {AvailableApps.filter((item) => !item.disabled).map((item, idx) =>
              renderItem(item, idx)
            )}
          </div>
          <div className="footer">
            <div className="title">{t('label.quick')}</div>
            {QuickAccessApps.filter((item) => !item.disabled).map((item, idx) =>
              renderItem(item, idx)
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
}
