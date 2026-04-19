import cx from 'classnames';
import ReactLoading from 'react-loading';
import './style.scss';

type Props = {
  className?: string;
  pageLoading?: boolean;
};

export default function AppLoading({
  className = '',
  pageLoading = false,
}: Props) {
  const containerClassName = cx(
    'loading-container',
    { 'page-loading': pageLoading },
    className
  );

  return (
    <div className={containerClassName}>
      <ReactLoading
        type="spinningBubbles"
        color="blue"
        height={50}
        width={50}
      />
    </div>
  );
}
