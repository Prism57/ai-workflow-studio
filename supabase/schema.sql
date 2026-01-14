-- AI Workflow Studio Database Schema
-- PostgreSQL / Supabase

-- =============================================
-- PROMPTS TABLE
-- 存储 AI 提示词模板
-- =============================================
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 启用 RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 允许认证用户完全访问 (可根据需求调整)
CREATE POLICY "Allow authenticated users full access to prompts"
  ON prompts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- WORKFLOWS TABLE
-- 存储工作流定义
-- =============================================
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 启用 RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Allow authenticated users full access to workflows"
  ON workflows
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- WORKFLOW_RUNS TABLE
-- 存储工作流执行记录
-- =============================================
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED')),
  logs JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 启用 RLS
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Allow authenticated users full access to workflow_runs"
  ON workflow_runs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_status ON workflow_runs(status);

-- =============================================
-- TRIGGERS: 自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
