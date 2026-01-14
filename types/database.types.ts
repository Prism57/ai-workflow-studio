// Supabase 数据库类型
// 运行以下命令生成完整类型:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          name: string
          content: string
          parameters: Json
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          parameters?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          parameters?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string | null
          steps: Json
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          steps?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          steps?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflow_runs: {
        Row: {
          id: string
          workflow_id: string
          status: string
          logs: Json
          user_id: string | null
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          workflow_id: string
          status?: string
          logs?: Json
          user_id?: string | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          workflow_id?: string
          status?: string
          logs?: Json
          user_id?: string | null
          started_at?: string
          completed_at?: string | null
        }
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
  }
}
