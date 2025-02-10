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
      assessment_results: {
        Row: {
          answers: Json
          assessment_id: string
          company_selection_status: string | null
          completed_at: string
          id: string
          score: number
          selection_message: string | null
          user_id: string
        }
        Insert: {
          answers: Json
          assessment_id: string
          company_selection_status?: string | null
          completed_at?: string
          id?: string
          score: number
          selection_message?: string | null
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          company_selection_status?: string | null
          completed_at?: string
          id?: string
          score?: number
          selection_message?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string | null
          company_name: string | null
          created_at: string
          green_job_category: string | null
          id: string
          is_ai_generated: boolean | null
          job_title: string | null
          promotes_diversity: boolean | null
          questions: Json
          remote_work_type: string | null
          sustainability_focus: string[] | null
          topic: string
          user_id: string
        }
        Insert: {
          assessment_type?: string | null
          company_name?: string | null
          created_at?: string
          green_job_category?: string | null
          id?: string
          is_ai_generated?: boolean | null
          job_title?: string | null
          promotes_diversity?: boolean | null
          questions: Json
          remote_work_type?: string | null
          sustainability_focus?: string[] | null
          topic: string
          user_id: string
        }
        Update: {
          assessment_type?: string | null
          company_name?: string | null
          created_at?: string
          green_job_category?: string | null
          id?: string
          is_ai_generated?: boolean | null
          job_title?: string | null
          promotes_diversity?: boolean | null
          questions?: Json
          remote_work_type?: string | null
          sustainability_focus?: string[] | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      company_sustainability: {
        Row: {
          carbon_neutral_target_year: number | null
          company_name: string
          created_at: string
          diversity_commitment: string | null
          green_initiatives: string[] | null
          id: string
          sustainability_certifications: string[] | null
        }
        Insert: {
          carbon_neutral_target_year?: number | null
          company_name: string
          created_at?: string
          diversity_commitment?: string | null
          green_initiatives?: string[] | null
          id?: string
          sustainability_certifications?: string[] | null
        }
        Update: {
          carbon_neutral_target_year?: number | null
          company_name?: string
          created_at?: string
          diversity_commitment?: string | null
          green_initiatives?: string[] | null
          id?: string
          sustainability_certifications?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          created_at: string
          id: string
          url: string
          user_id: string | null
          vulnerabilities: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          url: string
          user_id?: string | null
          vulnerabilities?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          url?: string
          user_id?: string | null
          vulnerabilities?: Json | null
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
      sustainability_category:
        | "green_technology"
        | "renewable_energy"
        | "waste_management"
        | "sustainable_agriculture"
        | "eco_friendly_construction"
        | "clean_transportation"
        | "environmental_conservation"
        | "circular_economy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
