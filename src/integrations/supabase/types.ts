export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      menu_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          order_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          points_earned: number
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_earned?: number
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_earned?: number
          restaurant_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      point_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          restaurant_id: string
          total_earned: number
          total_redeemed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          restaurant_id: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          restaurant_id?: string
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_balances_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          loyalty_level: string
          phone: string | null
          total_points: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          loyalty_level?: string
          phone?: string | null
          total_points?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          loyalty_level?: string
          phone?: string | null
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          cover_image_url: string | null
          created_at: string
          cuisine: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          loyalty_type: Database["public"]["Enums"]["loyalty_type"]
          name: string
          owner_id: string
          points_per_dollar: number
          stamps_required: number
          updated_at: string
          vendor_tier: Database["public"]["Enums"]["vendor_tier"]
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          loyalty_type?: Database["public"]["Enums"]["loyalty_type"]
          name: string
          owner_id: string
          points_per_dollar?: number
          stamps_required?: number
          updated_at?: string
          vendor_tier?: Database["public"]["Enums"]["vendor_tier"]
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          loyalty_type?: Database["public"]["Enums"]["loyalty_type"]
          name?: string
          owner_id?: string
          points_per_dollar?: number
          stamps_required?: number
          updated_at?: string
          vendor_tier?: Database["public"]["Enums"]["vendor_tier"]
        }
        Relationships: []
      }
      reward_item_links: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          points_earned: number
          reward_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          points_earned?: number
          reward_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          points_earned?: number
          reward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_item_links_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_item_links_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          points_required: number
          restaurant_id: string
          stamps_required: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          points_required?: number
          restaurant_id: string
          stamps_required?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          points_required?: number
          restaurant_id?: string
          stamps_required?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_logs: {
        Row: {
          action_type: string
          created_at: string
          customer_user_id: string
          id: string
          points_awarded: number
          restaurant_id: string
          stamps_awarded: number
          vendor_user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          customer_user_id: string
          id?: string
          points_awarded?: number
          restaurant_id: string
          stamps_awarded?: number
          vendor_user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          customer_user_id?: string
          id?: string
          points_awarded?: number
          restaurant_id?: string
          stamps_awarded?: number
          vendor_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      stamp_cards: {
        Row: {
          created_at: string
          current_stamps: number
          id: string
          is_complete: boolean
          restaurant_id: string
          total_stamps_required: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stamps?: number
          id?: string
          is_complete?: boolean
          restaurant_id: string
          total_stamps_required?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stamps?: number
          id?: string
          is_complete?: boolean
          restaurant_id?: string
          total_stamps_required?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_cards_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      tier_upgrade_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          current_tier: Database["public"]["Enums"]["vendor_tier"]
          id: string
          requested_by: string
          requested_tier: Database["public"]["Enums"]["vendor_tier"]
          restaurant_id: string
          status: Database["public"]["Enums"]["upgrade_request_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          current_tier?: Database["public"]["Enums"]["vendor_tier"]
          id?: string
          requested_by: string
          requested_tier?: Database["public"]["Enums"]["vendor_tier"]
          restaurant_id: string
          status?: Database["public"]["Enums"]["upgrade_request_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          current_tier?: Database["public"]["Enums"]["vendor_tier"]
          id?: string
          requested_by?: string
          requested_tier?: Database["public"]["Enums"]["vendor_tier"]
          restaurant_id?: string
          status?: Database["public"]["Enums"]["upgrade_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tier_upgrade_requests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          created_at: string
          id: string
          is_redeemed: boolean
          redeemed_at: string | null
          reward_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          reward_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "vendor" | "admin"
      loyalty_type: "stamps" | "points"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
      upgrade_request_status: "pending" | "approved" | "rejected"
      vendor_tier: "tier_1" | "tier_2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "vendor", "admin"],
      loyalty_type: ["stamps", "points"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      upgrade_request_status: ["pending", "approved", "rejected"],
      vendor_tier: ["tier_1", "tier_2"],
    },
  },
} as const
