import { FC } from 'react';
import contrat from '@/assets/images/contrat.png';

export interface StepContractProps {
  onSign: () => void;
  isSigned: boolean;
}

export const StepContract: FC<StepContractProps> = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <p className="text-2xl text-center">Mon contrat</p>

      {/* Contract text */}
      <div className=" overflow-y-auto border flex justify-center ">
        <img src={contrat} alt="Contrat" className=" object-cover h-[474px]" />
      </div>
    </div>
  );
};

export default StepContract;
