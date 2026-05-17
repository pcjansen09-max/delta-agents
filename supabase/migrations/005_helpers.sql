-- DeltaAgents helper RPCs (005)
-- Kleine SQL-functies die lib/* aanroept voor atomic updates.

-- Atomic increment van applied_count + bijwerken van last_applied_at
CREATE OR REPLACE FUNCTION deltaagents_increment_rule_applied(p_rule_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE deltaagents_wisdom_rules
  SET applied_count = applied_count + 1,
      last_applied_at = NOW()
  WHERE id = p_rule_id;
END;
$$;

GRANT EXECUTE ON FUNCTION deltaagents_increment_rule_applied(UUID) TO authenticated, anon;
