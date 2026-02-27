export type UserRole = 'customer' | 'vendor' | 'admin';
export type LoyaltyType = 'stamps' | 'points';
export type VendorTier = 'tier_1' | 'tier_2';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type UpgradeRequestStatus = 'pending' | 'approved' | 'rejected';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  total_points: number;
  loyalty_level: string;
  created_at: string;
  updated_at: string;
};

export type UserRoles = {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Restaurant = {
  id: string;
  owner_id: string;
  name: string;
  cuisine: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  loyalty_type: LoyaltyType;
  points_per_dollar: number;
  stamps_required: number;
  vendor_tier: VendorTier;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
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

export type RewardItemLink = {
  id: string;
  reward_id: string;
  menu_item_id: string;
  points_earned: number;
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

export type PointBalance = {
  id: string;
  user_id: string;
  restaurant_id: string;
  balance: number;
  total_earned: number;
  total_redeemed: number;
  created_at: string;
  updated_at: string;
};

export type UserReward = {
  id: string;
  user_id: string;
  reward_id: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  total_amount: number;
  points_earned: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type TierUpgradeRequest = {
  id: string;
  restaurant_id: string;
  requested_by: string;
  current_tier: VendorTier;
  requested_tier: VendorTier;
  status: UpgradeRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};
