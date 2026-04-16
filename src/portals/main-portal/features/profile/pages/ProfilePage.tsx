import { FC, useEffect, useState } from 'react';
import {
  NotificationPreferences,
  TwoFactorSettings,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from '@contracts/api-contracts';
import { profileService } from '@services/mock';
import Button from '@/components/shared/Button';
import ProfileTabs, { ProfileTabKey } from '../components/ProfileTabs';
import PersonalInfoTab from '../components/PersonalInfoTab';
import SecurityTab from '../components/SecurityTab';
import NotificationsTab from '../components/NotificationsTab';
import TwoFactorTab from '../components/TwoFactorTab';

const EMPTY_PASSWORD: UpdatePasswordRequest = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ProfilePage: FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('informations');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState<UpdatePasswordRequest>(EMPTY_PASSWORD);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailMarketing: false,
    emailSecurity: true,
    emailTransactions: true,
    smsAlerts: false,
    pushNotifications: true,
  });
  const [twoFactor, setTwoFactor] = useState<TwoFactorSettings>({
    enabled: false,
    method: 'email',
  });

  useEffect(() => {
    Promise.all([
      profileService.getProfile(),
      profileService.getNotifications(),
      profileService.getTwoFactor(),
    ])
      .then(([profileRes, notifRes, twoFactorRes]) => {
        setProfile(profileRes.data);
        setProfileForm({
          firstName: profileRes.data.firstName,
          lastName: profileRes.data.lastName,
          email: profileRes.data.email,
          phone: profileRes.data.phone,
        });
        setNotifications(notifRes.data);
        setTwoFactor(twoFactorRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const id = window.setTimeout(() => setFeedback(null), 2500);
    return () => window.clearTimeout(id);
  }, [feedback]);

  const handleAvatarChange = async (file: File) => {
    const res = await profileService.updateAvatar(file);
    if (res.success) {
      setProfile((prev) => (prev ? { ...prev, avatarUrl: res.data } : prev));
    }
  };

  const handleCancel = () => {
    if (activeTab === 'informations' && profile) {
      setProfileForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
    } else if (activeTab === 'security') {
      setPasswordForm(EMPTY_PASSWORD);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'informations') {
        const res = await profileService.updateProfile(profileForm);
        if (res.success) {
          setProfile(res.data);
          setFeedback('Profil mis à jour avec succès.');
        }
      } else if (activeTab === 'security') {
        const res = await profileService.updatePassword(passwordForm);
        setFeedback(res.message ?? null);
        if (res.success) setPasswordForm(EMPTY_PASSWORD);
      } else if (activeTab === 'notifications') {
        const res = await profileService.updateNotifications(notifications);
        if (res.success) setFeedback('Préférences enregistrées.');
      } else {
        const res = await profileService.updateTwoFactor(twoFactor);
        if (res.success) setFeedback('Paramètres 2FA enregistrés.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-[25px] border border-brand-border-soft bg-white p-4 sm:p-6 lg:p-10">
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full flex flex-col justify-between bg-white p-4 sm:p-6 lg:p-10">
      <div className="w-full flex flex-col justify-between max-w-3xl mx-auto">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        <div className="mt-10">
          {activeTab === 'informations' && (
            <PersonalInfoTab
              value={profileForm}
              profile={profile}
              onChange={setProfileForm}
              onAvatarChange={handleAvatarChange}
            />
          )}
          {activeTab === 'security' && (
            <SecurityTab value={passwordForm} onChange={setPasswordForm} />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab value={notifications} onChange={setNotifications} />
          )}
          {activeTab === 'two-factor' && <TwoFactorTab value={twoFactor} onChange={setTwoFactor} />}
        </div>

        {feedback && (
          <div
            className="mt-6 rounded-lg border border-brand-border-soft bg-brand-primary-soft px-4 py-2 text-center text-xs font-medium text-brand-primary"
            role="status"
          >
            {feedback}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <Button variant="cancel" onClick={handleCancel} disabled={saving}>
            Annuler
          </Button>
          <Button variant="confirm" onClick={handleSave} disabled={saving}>
            {saving ? '...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
