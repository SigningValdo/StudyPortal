import { FC, ReactNode } from 'react';

export interface ServiceCardProps {
  title: string;
  icon?: ReactNode;
  image: string;
  ctaLabel?: string;
  onClick?: () => void;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  title,
  icon,
  image,
  ctaLabel = 'Souscrire',
  onClick,
}) => {
  return (
    <div
      className="w-full overflow-hidden rounded-[25px] border bg-white shadow-sm sm:max-w-[344px]"
      style={{ borderColor: '#D8D8D8' }}
    >
      <div className="relative h-36 w-full overflow-hidden sm:h-40">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        >
          <div className="flex flex-col items-center gap-2 text-white">
            {icon && <div>{icon}</div>}
            <h3 className="text-center text-lg font-semibold">{title}</h3>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="block w-full py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#F88206' }}
      >
        {ctaLabel}
      </button>
    </div>
  );
};

export default ServiceCard;
