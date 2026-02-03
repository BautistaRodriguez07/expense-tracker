export interface UserInterface {
  id: string;
  clerk_id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
  password_hash: string;
  profile_image?: string;
  imageUrl?: string;
  settings_theme: string;
  settings_language: string;
  settings_font_size: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  is_system_admin: boolean;
  publicMetadata?: {
    activeSpaceId?: string;
  };
}
