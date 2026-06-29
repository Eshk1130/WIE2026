/**
 * src/lib/gameService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All Supabase DB interaction functions for WIE2026 – Crewmate Protocol
 */

import { supabase } from './supabase.js';

// ── localStorage keys ─────────────────────────────────────────────────────────
const PLAYER_KEY  = 'wie2026_player';
const SESSION_KEY = 'wie2026_session';

// ─────────────────────────────────────────────────────────────────────────────
// joinGame
// Upserts a player record (conflict on email) then creates a new session row.
// Persists both to localStorage and returns { player, sessionId }.
// ─────────────────────────────────────────────────────────────────────────────
export async function joinGame(displayName, email) {
  try {
    // 1. Upsert player --------------------------------------------------------
    const { data: playerRows, error: playerErr } = await supabase
      .from('players')
      .upsert(
        { display_name: displayName, email: email || null },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select();

    if (playerErr) throw playerErr;
    if (!playerRows || playerRows.length === 0) {
      throw new Error('joinGame: no player row returned after upsert.');
    }

    const player = playerRows[0];

    // 2. Insert session -------------------------------------------------------
    const { data: sessionRows, error: sessionErr } = await supabase
      .from('sessions')
      .insert({ player_id: player.id, logged_in_at: new Date().toISOString() })
      .select();

    if (sessionErr) throw sessionErr;
    if (!sessionRows || sessionRows.length === 0) {
      throw new Error('joinGame: no session row returned after insert.');
    }

    const sessionId = sessionRows[0].id;

    // 3. Persist to localStorage ----------------------------------------------
    localStorage.setItem(PLAYER_KEY,  JSON.stringify(player));
    localStorage.setItem(SESSION_KEY, sessionId);

    return { player, sessionId };
  } catch (err) {
    console.error('[gameService] joinGame failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// leaveGame
// Stamps logged_out_at on the active session and calculates duration_secs.
// Clears localStorage.
// ─────────────────────────────────────────────────────────────────────────────
export async function leaveGame(sessionId) {
  if (!sessionId) return;

  try {
    // Fetch logged_in_at so we can compute duration
    const { data: sessionRow, error: fetchErr } = await supabase
      .from('sessions')
      .select('logged_in_at')
      .eq('id', sessionId)
      .single();

    if (fetchErr) throw fetchErr;

    const loggedInAt  = sessionRow?.logged_in_at ? new Date(sessionRow.logged_in_at) : new Date();
    const loggedOutAt = new Date();
    const durationSecs = Math.round((loggedOutAt - loggedInAt) / 1000);

    const { error: updateErr } = await supabase
      .from('sessions')
      .update({
        logged_out_at: loggedOutAt.toISOString(),
        duration_secs: durationSecs,
      })
      .eq('id', sessionId);

    if (updateErr) throw updateErr;
  } catch (err) {
    // Best-effort — don't block teardown on error
    console.error('[gameService] leaveGame failed:', err);
  } finally {
    localStorage.removeItem(PLAYER_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getStoredPlayer
// Restores player + sessionId from localStorage.
// Returns { player, sessionId } or { player: null, sessionId: null }.
// ─────────────────────────────────────────────────────────────────────────────
export function getStoredPlayer() {
  try {
    const raw = localStorage.getItem(PLAYER_KEY);
    const player    = raw ? JSON.parse(raw) : null;
    const sessionId = localStorage.getItem(SESSION_KEY) || null;
    return { player, sessionId };
  } catch {
    return { player: null, sessionId: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// recordScore
// Inserts a score row for the given player + session.
// ─────────────────────────────────────────────────────────────────────────────
export async function recordScore(playerId, sessionId, { score, role, survived, tasks_done }) {
  try {
    const { error } = await supabase
      .from('scores')
      .insert({
        player_id:  playerId,
        session_id: sessionId,
        score,
        role,
        survived: !!survived,
        tasks_done: tasks_done ?? 0,
        recorded_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (err) {
    console.error('[gameService] recordScore failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchLeaderboard
// Returns top N players from admin_player_summary ordered by total_score DESC.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchLeaderboard(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('admin_player_summary')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('[gameService] fetchLeaderboard failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchAdminSummary
// Returns all rows from admin_player_summary ordered by last_seen DESC.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAdminSummary() {
  try {
    const { data, error } = await supabase
      .from('admin_player_summary')
      .select('*')
      .order('last_seen', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('[gameService] fetchAdminSummary failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchAllSessions
// Returns sessions joined with player display_name + email, newest first.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAllSessions() {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        logged_in_at,
        logged_out_at,
        duration_secs,
        players ( display_name, email )
      `)
      .order('logged_in_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('[gameService] fetchAllSessions failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchAllScores
// Returns scores joined with player display_name + email, newest first.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAllScores() {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        id,
        score,
        role,
        survived,
        tasks_done,
        recorded_at,
        players ( display_name, email )
      `)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('[gameService] fetchAllScores failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchAuditLog
// Returns the most recent N rows from audit_log (read-only from frontend).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAuditLog(limit = 500) {
  try {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('[gameService] fetchAuditLog failed:', err);
    throw err;
  }
}
