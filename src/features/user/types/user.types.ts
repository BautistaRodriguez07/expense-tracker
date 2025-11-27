export interface UserInterface {
  id: number;
  clerk_id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  password_hash: string;
  settings_theme: string;
  settings_language: string;
  settings_font_size: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  is_system_admin: boolean;
}
