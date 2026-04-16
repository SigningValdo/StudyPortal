import { FC } from 'react';
import { UpdateProfileRequest, UserProfile } from '@contracts/api-contracts';
import ProfileField from './ProfileField';
import AvatarEditor from './AvatarEditor';

export interface PersonalInfoTabProps {
  value: UpdateProfileRequest;
  profile: UserProfile | null;
  onChange: (value: UpdateProfileRequest) => void;
  onAvatarChange: (file: File) => void;
}

export const PersonalInfoTab: FC<PersonalInfoTabProps> = ({
  value,
  profile,
  onChange,
  onAvatarChange,
}) => {
  const update = <K extends keyof UpdateProfileRequest>(key: K, next: UpdateProfileRequest[K]) =>
    onChange({ ...value, [key]: next });

  const alt = `${value.firstName} ${value.lastName}`.trim() || 'Utilisateur';

  return (
    <div className="flex flex-col gap-10">
      <AvatarEditor avatarUrl={profile?.avatarUrl} alt={alt} onFileChange={onAvatarChange} />

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-[60px] lg:grid-cols-2">
        <ProfileField
          label="Nom"
          value={value.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <ProfileField
          label="Prénom"
          value={value.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
        <ProfileField
          label="Email"
          type="email"
          value={value.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <ProfileField
          label="Numéro de téléphone"
          value={value.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoTab;
