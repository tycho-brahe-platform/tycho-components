import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from 'tycho-storybook';
import CookieStorage from '../configs/CookieStorage';
import logo from '../configs/types/logo.png';
import './style.scss';

type Props = {
  children: ReactNode;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default function ErrorBoundary({ children }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation('base');
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Caught by ErrorBoundary:', error);
      setState({ hasError: true, error });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason);
    };

    const onWindowError = (event: ErrorEvent) => {
      handleError(event.error);
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('error', onWindowError);

    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('error', onWindowError);
    };
  }, []);

  const handleRedirect = () => {
    navigate('/', { replace: true });
  };

  const handleRetry = () => {
    const redirectUri = CookieStorage.getRedirectUri();
    redirectUri ? (window.location.href = redirectUri) : handleRedirect();
  };

  if (state.hasError && state.error) {
    const errorJson = JSON.stringify(
      {
        name: state.error.name,
        message: state.error.message,
        stack: state.error.stack,
      },
      null,
      2
    );

    return (
      <div className="box-container">
        <div className="box">
          <img src={logo} />
          <div className="title">{t('label.error.found')}</div>
          <div className="buttons">
            <Button
              text={t('label.retry')}
              size="small"
              onClick={handleRetry}
            />
            <Button
              text={t('label.redirect')}
              size="small"
              onClick={handleRedirect}
            />
            <Button
              text={t('label.error.details')}
              size="small"
              onClick={() => setShowDetails(!showDetails)}
            />
          </div>
        </div>
        {showDetails && <pre className="error-stack">{errorJson}</pre>}
      </div>
    );
  }

  return <>{children}</>;
}
