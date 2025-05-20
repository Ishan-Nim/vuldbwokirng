export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      references: {
        Row: {
          created_at: string
          id: string
          ref_title: string | null
          ref_type: string | null
          ref_url: string | null
          vulnerability_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ref_title?: string | null
          ref_type?: string | null
          ref_url?: string | null
          vulnerability_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ref_title?: string | null
          ref_type?: string | null
          ref_url?: string | null
          vulnerability_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "references_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      remediations: {
        Row: {
          created_at: string
          id: string
          priority_level: string | null
          recommendation: string | null
          vulnerability_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          priority_level?: string | null
          recommendation?: string | null
          vulnerability_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          priority_level?: string | null
          recommendation?: string | null
          vulnerability_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remediations_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_modeling: {
        Row: {
          business_impact_detail: string | null
          created_at: string
          detectability: number | null
          exploitability: number | null
          id: string
          prevalence: number | null
          technical_impact_score: number | null
          vulnerability_id: string | null
        }
        Insert: {
          business_impact_detail?: string | null
          created_at?: string
          detectability?: number | null
          exploitability?: number | null
          id?: string
          prevalence?: number | null
          technical_impact_score?: number | null
          vulnerability_id?: string | null
        }
        Update: {
          business_impact_detail?: string | null
          created_at?: string
          detectability?: number | null
          exploitability?: number | null
          id?: string
          prevalence?: number | null
          technical_impact_score?: number | null
          vulnerability_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threat_modeling_vulnerability_id_fkey"
            columns: ["vulnerability_id"]
            isOneToOne: false
            referencedRelation: "vulnerabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      vulnerabilities: {
        Row: {
          business_impact: string | null
          created_at: string
          description: string | null
          id: string
          is_vulnerable: boolean | null
          risk_rating: string | null
          severity: string | null
          technical_impact: string | null
          title: string
          updated_at: string
        }
        Insert: {
          business_impact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_vulnerable?: boolean | null
          risk_rating?: string | null
          severity?: string | null
          technical_impact?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          business_impact?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_vulnerable?: boolean | null
          risk_rating?: string | null
          severity?: string | null
          technical_impact?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
