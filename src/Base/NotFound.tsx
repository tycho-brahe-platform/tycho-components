import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../configs/types/logo.png';
import './style.scss';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation('base');

  const handleRedirect = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="box-container">
      <div className="box">
        <img src={logo} />
        <div className="title">{t('notfound.label.disclaimer')}</div>
        <div className="subtitle" onClick={handleRedirect}>
          {t('label.redirect')}
        </div>
      </div>
    </div>
  );
}
