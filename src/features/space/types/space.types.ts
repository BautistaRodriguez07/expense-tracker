export interface SpaceInterface {
  id: number;
  name: string;
  members: SpaceMemberInterface[];
  default_currency: string;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface SpaceMemberInterface {
  id: number;
  user_id: number;
  space_id: number;
  role: string;
  joined_at: Date;
}
