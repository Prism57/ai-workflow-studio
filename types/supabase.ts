// Supabase 类型定义
// 运行以下命令生成类型:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

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
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['prompts']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['prompts']['Insert']>
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string | null
          steps: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['workflows']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['workflows']['Insert']>
      }
      workflow_runs: {
        Row: {
          id: string
          workflow_id: string
          status: string
          logs: Json
          started_at: string
          completed_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['workflow_runs']['Row'],
          'id' | 'started_at'
        >
        Update: Partial<Database['public']['Tables']['workflow_runs']['Insert']>
      }
    }
  }
}
