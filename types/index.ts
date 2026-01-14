// AI Workflow Studio 共享类型定义

export interface Prompt {
  id: string
  name: string
  content: string
  parameters: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  steps: WorkflowStep[]
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  prompt_id: string
  order: number
  input_map: Record<string, string>
}

export interface WorkflowRun {
  id: string
  workflow_id: string
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'
  logs: WorkflowLog[]
  started_at: string
  completed_at?: string
}

export interface WorkflowLog {
  step_order: number
  input: Record<string, unknown>
  output?: string
  error?: string
  timestamp: string
}
