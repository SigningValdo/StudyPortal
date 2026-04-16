import {
  ApiResponse,
  NotificationPreferences,
  TwoFactorSettings,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from '@contracts/api-contracts';

const MOCK_PROFILE: UserProfile = {
  id: 'profile-001',
  firstName: 'Kevin',
  lastName: 'Fleming',
  email: 'jaskolski.brent@yahoo.com',
  phone: '546-933-2772',
};

const MOCK_NOTIFICATIONS: NotificationPreferences = {
  emailMarketing: false,
  emailSecurity: true,
  emailTransactions: true,
  smsAlerts: false,
  pushNotifications: true,
};

const MOCK_TWO_FACTOR: TwoFactorSettings = {
  enabled: false,
  method: 'email',
  email: MOCK_PROFILE.email,
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    await delay();
    return { success: true, data: { ...MOCK_PROFILE }, message: 'OK' };
  },

  updateProfile: async (
    payload: UpdateProfileRequest,
  ): Promise<ApiResponse<UserProfile>> => {
    await delay(500);
    Object.assign(MOCK_PROFILE, payload);
    return {
      success: true,
      data: { ...MOCK_PROFILE },
      message: 'Profil mis à jour',
    };
  },

  updatePassword: async (
    payload: UpdatePasswordRequest,
  ): Promise<ApiResponse<boolean>> => {
    await delay(500);
    if (payload.newPassword !== payload.confirmPassword) {
      return {
        success: false,
        data: false,
        message: 'Les mots de passe ne correspondent pas',
      };
    }
    if (payload.newPassword.length < 8) {
      return {
        success: false,
        data: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      };
    }
    return { success: true, data: true, message: 'Mot de passe mis à jour' };
  },

  updateAvatar: async (file: File): Promise<ApiResponse<string>> => {
    await delay(600);
    const url = URL.createObjectURL(file);
    MOCK_PROFILE.avatarUrl = url;
    return { success: true, data: url, message: 'Photo mise à jour' };
  },

  getNotifications: async (): Promise<ApiResponse<NotificationPreferences>> => {
    await delay();
    return { success: true, data: { ...MOCK_NOTIFICATIONS }, message: 'OK' };
  },

  updateNotifications: async (
    payload: NotificationPreferences,
  ): Promise<ApiResponse<NotificationPreferences>> => {
    await delay(400);
    Object.assign(MOCK_NOTIFICATIONS, payload);
    return {
      success: true,
      data: { ...MOCK_NOTIFICATIONS },
      message: 'Préférences mises à jour',
    };
  },

  getTwoFactor: async (): Promise<ApiResponse<TwoFactorSettings>> => {
    await delay();
    return { success: true, data: { ...MOCK_TWO_FACTOR }, message: 'OK' };
  },

  updateTwoFactor: async (
    payload: TwoFactorSettings,
  ): Promise<ApiResponse<TwoFactorSettings>> => {
    await delay(400);
    Object.assign(MOCK_TWO_FACTOR, payload);
    return {
      success: true,
      data: { ...MOCK_TWO_FACTOR },
      message: '2FA mise à jour',
    };
  },
};
