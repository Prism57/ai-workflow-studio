-- =============================================
-- 用户数据隔离：添加 user_id 字段
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 添加 user_id 列
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 删除旧的 RLS 策略
DROP POLICY IF EXISTS "Allow authenticated users full access to prompts" ON prompts;
DROP POLICY IF EXISTS "Allow authenticated users full access to workflows" ON workflows;
DROP POLICY IF EXISTS "Allow authenticated users full access to workflow_runs" ON workflow_runs;

-- 创建基于用户的 RLS 策略
CREATE POLICY "Users can manage own prompts" ON prompts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own workflows" ON workflows
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own workflow_runs" ON workflow_runs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_id ON workflow_runs(user_id);
