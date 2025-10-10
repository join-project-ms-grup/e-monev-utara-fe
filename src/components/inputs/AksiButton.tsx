import clsx from 'clsx';
import type { IconType } from 'react-icons/lib';

interface AksiButton {
  onClick?: () => void;
  Icon: IconType;
  iconClassName?: string;
  className?: string;
  hoverColor?: string;
  tooltip?: string;
  tooltipId?: string;
}

const AksiButton = ({
  onClick,
  Icon,
  iconClassName,
  className,
  hoverColor = 'bg-cyan-400',
  tooltip,
  tooltipId = 'tooltip',
  ...props
}: AksiButton) => {
  const iconCN = clsx(iconClassName, 'text-xl');
  const btnCN = clsx(
    className,
    'p-1 transition-all rounded-full hover:text-[var(--text-3)] active:scale-90',
    `hover:${hoverColor}`
  );

  return (
    <>
      <button
        type='button'
        {...(tooltip ? { 'data-tooltip-id': tooltipId } : {})}
        {...(tooltip ? { 'data-tooltip-content': tooltip } : {})}
        className={btnCN}
        onClick={onClick}
        {...props}
      >
        {Icon && <Icon className={iconCN} />}
      </button>
    </>
  );
};

export default AksiButton;
