import { FC } from 'react';
import { UpdatePasswordRequest } from '@contracts/api-contracts';
import PasswordField from './PasswordField';

export interface SecurityTabProps {
  value: UpdatePasswordRequest;
  onChange: (value: UpdatePasswordRequest) => void;
}

export const SecurityTab: FC<SecurityTabProps> = ({ value, onChange }) => {
  const update = <K extends keyof UpdatePasswordRequest>(key: K, next: UpdatePasswordRequest[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-6">
      <PasswordField
        label="Mon mot de passe"
        value={value.currentPassword}
        onChange={(v) => update('currentPassword', v)}
        placeholder="••••••••"
      />
      <PasswordField
        label="Nouveau mot de passe"
        value={value.newPassword}
        onChange={(v) => update('newPassword', v)}
        placeholder="••••••••"
      />
      <PasswordField
        label="Confirmer le nouveau mot de passe"
        value={value.confirmPassword}
        onChange={(v) => update('confirmPassword', v)}
        placeholder="••••••••"
      />
    </div>
  );
};

export default SecurityTab;
