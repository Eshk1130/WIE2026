-- ============================================================================
-- supabase/migration_v3.sql
-- WIE2026 – The Cypher Trail  ·  Schema Migration v3
-- ============================================================================
-- Adds per-question tracking columns to the `scores` table and updates
-- the admin_player_summary view to expose round-level aggregates.
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → paste & run.
--   This migration is IDEMPOTENT — safe to re-run.
-- ============================================================================

-- ── 1. New columns on `scores` ────────────────────────────────────────────────

ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS question_detail  JSONB,     -- per-question detail array
  ADD COLUMN IF NOT EXISTS correct_count    INTEGER,   -- number of correct answers (Round 1)
  ADD COLUMN IF NOT EXISTS wrong_count      INTEGER;   -- number of wrong answers  (Round 1)

-- Index for fast filtering by correct_count
CREATE INDEX IF NOT EXISTS idx_scores_correct_count ON scores (correct_count);

-- ── 2. Recreate admin_player_summary to expose updated columns ────────────────

DROP VIEW IF EXISTS admin_player_summary;

CREATE VIEW admin_player_summary
  WITH (security_invoker = false)
AS
SELECT
  p.id                                                        AS player_id,
  p.display_name,
  p.email,
  p.avatar_url,
  p.created_at,
  p.auth_id,

  -- Session stats
  COUNT(DISTINCT s.id)                                        AS total_sessions,
  MAX(s.logged_in_at)                                         AS last_seen,
  COALESCE(SUM(s.duration_secs), 0)                          AS total_time_secs,

  -- Score stats
  COUNT(sc.id)                                                AS total_games,
  COALESCE(SUM(sc.score), 0)                                 AS total_score,
  ROUND(AVG(sc.score)::numeric, 1)                           AS avg_score,

  -- NEW: aggregate correct / wrong counts (relevant for Round 1)
  COALESCE(SUM(sc.correct_count), 0)                         AS total_correct,
  COALESCE(SUM(sc.wrong_count), 0)                           AS total_wrong,

  -- NEW: total scored time across all rounds
  COALESCE(SUM(sc.time_taken_secs), 0)                       AS total_scored_time_secs

FROM players p
LEFT JOIN sessions s  ON s.player_id  = p.id
LEFT JOIN scores  sc  ON sc.player_id = p.id
GROUP BY p.id, p.display_name, p.email, p.avatar_url, p.created_at, p.auth_id;

-- ── 3. Grants ─────────────────────────────────────────────────────────────────

GRANT SELECT ON admin_player_summary TO anon;
GRANT SELECT ON admin_player_summary TO authenticated;
GRANT SELECT ON admin_player_summary TO service_role;

-- Ensure write access to new columns (INSERT grants cover all columns)
-- No change needed — INSERT grants on scores already set in migration_v2.sql.

-- ── 4. Verify ─────────────────────────────────────────────────────────────────
-- Run these to confirm:
--   SELECT column_name FROM information_schema.columns WHERE table_name = 'scores' ORDER BY ordinal_position;
--   SELECT * FROM admin_player_summary LIMIT 3;
