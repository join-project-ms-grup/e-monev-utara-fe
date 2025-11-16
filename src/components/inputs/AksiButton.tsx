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
  label?:string
  type?: "button" | "submit" | "reset" | undefined;
}

const AksiButton = ({
  onClick,
  Icon,
  iconClassName,
  className,
  hoverColor = 'bg-cyan-400',
  tooltip,
  tooltipId = 'tooltip',
  label,
  type = 'button',
  ...props
}: AksiButton) => {
  const iconCN = clsx(iconClassName, 'text-xl');
  const btnCN = clsx(
    className,
    `${label ? 'px-2 py-1' : 'p-2'}`,
    'transition-all bg-red-50 shadow-sm rounded-full hover:text-[var(--text-3)] scale-85 active:scale-70',
    `hover:${hoverColor}`,
  );

  return (
    <>
      <button
        type={type}
        {...(tooltip ? { 'data-tooltip-id': tooltipId } : {})}
        {...(tooltip ? { 'data-tooltip-content': tooltip } : {})}
        className={btnCN}
        onClick={onClick}
        {...props}
      >
        {label ? 
        (Icon && <span className='inline-flex gap-1 items-center mt-1 mr-1'><Icon className={iconCN} />{label}</span>)
        : 
        (Icon && <Icon className={iconCN} />)
        }
      </button>
    </>
  );
};

export default AksiButton;
