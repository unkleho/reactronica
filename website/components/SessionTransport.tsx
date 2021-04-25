import Icon from './Icon';

type Props = {
  isPlaying: boolean;
  bpm: number;
  className?: string;
  onPlayClick?: Function;
};

const SessionTransport: React.FunctionComponent<Props> = ({
  isPlaying,
  bpm,
  className,
  onPlayClick,
}) => {
  const handlePlayClick = () => {
    if (typeof onPlayClick === 'function') {
      onPlayClick();
    }
  };

  return (
    <div className={['flex align-middle', className || ''].join(' ')}>
      <div className="mr-2">
        <button className="p-2" onClick={handlePlayClick}>
          <Icon name={isPlaying ? 'square' : 'play'}></Icon>
        </button>
      </div>

      <div className="p-2 bg-black text-sm">
        <p>{bpm} bpm</p>
      </div>
    </div>
  );
};

export default SessionTransport;
