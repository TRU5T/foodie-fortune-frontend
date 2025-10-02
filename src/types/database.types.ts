
export type Restaurant = {
  id: string;
  owner_id: string | null;
  name: string;
  cuisine: string | null;
  description: string | null;
  logo_url: string | null;
  points_per_dollar: number;
  stamps_required: number;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  total_points: number;
  loyalty_level: string;
  created_at: string;
};

export type StampCard = {
  id: string;
  user_id: string;
  restaurant_id: string;
  current_stamps: number;
  total_stamps_required: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type Reward = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  points_required: number;
  stamps_required: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserReward = {
  id: string;
  user_id: string;
  reward_id: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
};

export type UserRole = 'customer' | 'vendor' | 'admin';

export type UserRoles = {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};
