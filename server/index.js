import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// ── Supabase ───────────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(cors());
app.use(express.json());


// ============================================================
// HELPERS
// ============================================================

function generateGroupCode() {
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const p = Array.from({ length: 3 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join('');
  return `${p}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const ADJ1 = ['heavy','silent','wild','bright','dark','swift','golden','iron','frozen','hollow','ancient','brave','calm','fierce','gentle','hidden','lost','mighty','pale','proud','sharp','tall','vast','warm','young'];
const ADJ2 = ['autumn','winter','summer','spring','dawn','dusk','ember','stone','river','ocean','forest','desert','thunder','shadow','silver','amber','crimson','jade','onyx','storm','smoke','frost','flame','tide','mist'];
const NOUN = ['wolf','hawk','bear','fox','crow','elk','owl','raven','lion','tiger','falcon','lynx','drake','viper','crane','heron','bison','cobra','eagle','panther','stallion','jaguar','orca','moose','boar'];

function generatePublicName() {
  const a1 = ADJ1[Math.floor(Math.random() * ADJ1.length)];
  const a2 = ADJ2[Math.floor(Math.random() * ADJ2.length)];
  const n = NOUN[Math.floor(Math.random() * NOUN.length)];
  return `${a1}-${a2}-${n}`;
}

// ── Fuzzy matching (same logic as frontend prototype) ──────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}

function fuzzyMatch(userInput, correctAnswer, aliases) {
  const u = userInput.trim().toLowerCase().replace(/[.,!?']/g, '');
  const a = correctAnswer.trim().toLowerCase().replace(/[.,!?']/g, '');
  if (!u) return false;

  // Exact or substring match
  if (u === a || a.includes(u) || u.includes(a)) return true;

  // Aliases from the database (stored as JSON array)
  const aliasList = Array.isArray(aliases) ? aliases.map(s => s.toLowerCase()) : [];
  if (aliasList.includes(u)) return true;

  // Levenshtein distance
  const threshold = a.length <= 5 ? 1 : 2;
  if (levenshtein(u, a) <= threshold) return true;

  // Key-word matching (ignoring stop words)
  const stop = new Set(['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'is', 'was']);
  const aWords = a.split(/\s+/).filter(w => w.length > 1 && !stop.has(w));
  const uWords = u.split(/\s+/);
  if (aWords.length > 0 && aWords.every(x => uWords.some(y => y === x || levenshtein(y, x) <= 1))) return true;

  return false;
}

// ── Scoring (matches frontend prototype logic) ────────────────────────────
function calcScore(correct, timeLeft, timeLimit, streak) {
  if (!correct) return 0;
  return 100 + (timeLimit ? Math.floor((timeLeft / timeLimit) * 50) : 0) + streak * 10;
}

// ── Get Monday of the current week (for weekly leaderboard) ───────────────
function getWeekStart(dateStr) {
  const d = new Date(dateStr || new Date().toISOString().split('T')[0]);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  d.setDate(d.getDate() - diff);
  return d.toISOString().split('T')[0];
}


// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// ============================================================
// AUTH
// ============================================================

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, handle } = req.body;
    if (!handle || handle.trim().length < 2) {
      return res.status(400).json({ error: 'Handle must be at least 2 characters' });
    }

    const publicName = generatePublicName();

    // If email+password provided, use Supabase Auth
    if (email && password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) return res.status(400).json({ error: authError.message });

      const userId = authData.user.id;
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email,
        handle: handle.trim(),
        public_name: publicName,
        auth_provider: 'email',
      });
      if (userError) return res.status(400).json({ error: userError.message });

      return res.json({ user: { id: userId, email, handle: handle.trim(), public_name: publicName } });
    }

    // No email — create a "guest" user (local-only ID)
    const { data: guest, error: guestError } = await supabase.from('users').insert({
      handle: handle.trim(),
      public_name: publicName,
      auth_provider: 'guest',
    }).select().single();

    if (guestError) return res.status(400).json({ error: guestError.message });
    return res.json({ user: { id: guest.id, handle: guest.handle, public_name: guest.public_name } });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// PUZZLES
// ============================================================

// GET /api/puzzle/today?mode=normal
app.get('/api/puzzle/today', async (req, res) => {
  try {
    const mode = req.query.mode || 'normal';
    const today = new Date().toISOString().split('T')[0];

    const { data: puzzle, error: puzzleError } = await supabase
      .from('puzzles')
      .select('id, scheduled_date, theme, day_of_week')
      .eq('scheduled_date', today)
      .single();

    if (puzzleError || !puzzle) {
      return res.status(404).json({ error: 'No puzzle scheduled for today' });
    }

    // Return questions WITHOUT answers
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, position, type, question, options, time_limit')
      .eq('puzzle_id', puzzle.id)
      .eq('mode', mode)
      .order('position', { ascending: true });

    if (qError) return res.status(500).json({ error: qError.message });

    res.json({ puzzle, questions });
  } catch (error) {
    console.error('Puzzle fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/puzzle/submit
app.post('/api/puzzle/submit', async (req, res) => {
  try {
    const { userId, puzzleId, answers, timeTakenMs, mode } = req.body;
    const puzzleMode = mode || 'normal';

    if (!userId || !puzzleId || !answers) {
      return res.status(400).json({ error: 'Missing userId, puzzleId, or answers' });
    }

    // Check if already played this mode today
    const { data: existing } = await supabase
      .from('puzzle_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('puzzle_id', puzzleId)
      .eq('mode', puzzleMode)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Already played this puzzle in this mode' });
    }

    // Get questions WITH answers for server-side validation
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, answer, aliases, position, type, time_limit')
      .eq('puzzle_id', puzzleId)
      .eq('mode', puzzleMode)
      .order('position', { ascending: true });

    if (qError || !questions || questions.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    // Score each answer
    let correctCount = 0;
    let totalScore = 0;
    let streak = 0;
    const breakdown = [];

    for (const q of questions) {
      const userAnswer = answers[q.id] || '';
      let correct = false;

      if (q.type === 'type_in') {
        correct = fuzzyMatch(userAnswer, q.answer, q.aliases);
      } else {
        // Multiple choice, true/false, timed — exact match
        correct = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      }

      if (correct) {
        correctCount++;
        streak++;
      } else {
        streak = 0;
      }

      // For timed questions, the client sends time_left as part of the answer object
      // For now, give base 100 + streak bonus (time bonus can be added later)
      const pts = calcScore(correct, 0, 0, streak);
      totalScore += pts;

      breakdown.push({ question_id: q.id, correct, pts, userAnswer });
    }

    // Save attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('puzzle_attempts')
      .insert({
        user_id: userId,
        puzzle_id: puzzleId,
        mode: puzzleMode,
        score: totalScore,
        correct_count: correctCount,
        total_questions: questions.length,
        time_taken_ms: timeTakenMs || null,
        breakdown,
      })
      .select()
      .single();

    if (attemptError) {
      // Unique constraint violation = already played
      if (attemptError.code === '23505') {
        return res.status(409).json({ error: 'Already played this puzzle in this mode' });
      }
      return res.status(500).json({ error: attemptError.message });
    }

    // Get puzzle date for leaderboard updates
    const { data: puzzle } = await supabase
      .from('puzzles')
      .select('scheduled_date')
      .eq('id', puzzleId)
      .single();

    const puzzleDate = puzzle?.scheduled_date || new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart(puzzleDate);

    // Update leaderboard_daily (upsert — add to existing score if they played both modes)
    await supabase.rpc('upsert_leaderboard_daily', {
      p_user_id: userId,
      p_puzzle_date: puzzleDate,
      p_score: totalScore,
    }).catch(() => {
      // Fallback: manual upsert if RPC doesn't exist yet
      return supabase.from('leaderboard_daily').upsert({
        user_id: userId,
        puzzle_date: puzzleDate,
        total_score: totalScore,
      }, { onConflict: 'user_id,puzzle_date' });
    });

    // Update leaderboard_weekly
    const { data: weeklyRow } = await supabase
      .from('leaderboard_weekly')
      .select('total_score')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .maybeSingle();

    if (weeklyRow) {
      await supabase.from('leaderboard_weekly')
        .update({ total_score: weeklyRow.total_score + totalScore })
        .eq('user_id', userId)
        .eq('week_start', weekStart);
    } else {
      await supabase.from('leaderboard_weekly')
        .insert({ user_id: userId, week_start: weekStart, total_score: totalScore });
    }

    // Update leaderboard_alltime
    const { data: allTimeRow } = await supabase
      .from('leaderboard_alltime')
      .select('total_score')
      .eq('user_id', userId)
      .maybeSingle();

    if (allTimeRow) {
      await supabase.from('leaderboard_alltime')
        .update({ total_score: allTimeRow.total_score + totalScore })
        .eq('user_id', userId);
    } else {
      await supabase.from('leaderboard_alltime')
        .insert({ user_id: userId, total_score: totalScore });
    }

    // Update user XP and streak
    const xpGained = 50 + (correctCount * 10);
    const { data: userRow } = await supabase
      .from('users')
      .select('xp, streak, streak_last_day')
      .eq('id', userId)
      .single();

    if (userRow) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const newStreak = userRow.streak_last_day === yesterdayStr
        ? userRow.streak + 1
        : userRow.streak_last_day === puzzleDate
          ? userRow.streak  // already played today, keep streak
          : 1;              // streak broken, restart at 1

      await supabase.from('users').update({
        xp: (userRow.xp || 0) + xpGained,
        streak: newStreak,
        streak_last_day: puzzleDate,
      }).eq('id', userId);
    }

    res.json({
      attempt_id: attempt.id,
      score: totalScore,
      correct_count: correctCount,
      total_questions: questions.length,
      breakdown: breakdown.map(b => ({ question_id: b.question_id, correct: b.correct, pts: b.pts })),
      xp_gained: xpGained,
    });

  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/puzzle/check-answer
// Checks a single answer server-side, returns correct + the right answer
app.post('/api/puzzle/check-answer', async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    if (!questionId) return res.status(400).json({ error: 'Missing questionId' });

    const { data: q, error: qError } = await supabase
      .from('questions')
      .select('id, answer, aliases, type')
      .eq('id', questionId)
      .single();

    if (qError || !q) return res.status(404).json({ error: 'Question not found' });

    let correct = false;
    if (q.type === 'type_in') {
      correct = fuzzyMatch(userAnswer || '', q.answer, q.aliases);
    } else {
      correct = (userAnswer || '').trim().toLowerCase() === q.answer.trim().toLowerCase();
    }

    res.json({ correct, answer: q.answer });
  } catch (error) {
    console.error('Check answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// GROUPS
// ============================================================

// GET /api/groups?userId=xxx
app.get('/api/groups', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    // Get groups this user belongs to
    const { data: memberships, error: mError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);

    if (mError) return res.status(500).json({ error: mError.message });
    if (!memberships || memberships.length === 0) return res.json({ groups: [] });

    const groupIds = memberships.map(m => m.group_id);

    const { data: groups, error: gError } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds);

    if (gError) return res.status(500).json({ error: gError.message });

    // For each group, get members with their handles
    const enriched = await Promise.all(groups.map(async (g) => {
      const { data: members } = await supabase
        .from('group_members')
        .select('user_id, users(id, handle, avatar_color)')
        .eq('group_id', g.id);

      return {
        ...g,
        members: (members || []).map(m => ({
          id: m.users?.id,
          name: m.users?.id === userId ? 'You' : m.users?.handle,
          avatar_color: m.users?.avatar_color,
        })),
      };
    }));

    res.json({ groups: enriched });
  } catch (error) {
    console.error('Groups fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/groups  (create)
app.post('/api/groups', async (req, res) => {
  try {
    const { userId, name, hardMode } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'Missing userId or name' });

    const code = generateGroupCode();

    const { data: group, error: gError } = await supabase
      .from('groups')
      .insert({ name: name.trim(), code, creator_id: userId, hard_mode: hardMode || false })
      .select()
      .single();

    if (gError) return res.status(500).json({ error: gError.message });

    // Add creator as first member
    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });

    res.json({ group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/groups/join
app.post('/api/groups/join', async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ error: 'Missing userId or code' });

    const { data: group, error: gError } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single();

    if (gError || !group) return res.status(404).json({ error: 'Group not found. Check the code and try again.' });

    // Check if already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) return res.status(409).json({ error: 'You are already in this group' });

    await supabase.from('group_members').insert({ group_id: group.id, user_id: userId });

    res.json({ group });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /api/groups/:id/leave
app.delete('/api/groups/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// LEADERBOARDS
// ============================================================

// GET /api/leaderboard/global?period=daily
app.get('/api/leaderboard/global', async (req, res) => {
  try {
    const period = req.query.period || 'daily';
    const userId = req.query.userId;
    let entries = [];
    let userRank = null;
    let userScore = null;

    if (period === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('leaderboard_daily')
        .select('user_id, total_score, users(public_name)')
        .eq('puzzle_date', today)
        .order('total_score', { ascending: false })
        .limit(10);
      entries = (data || []).map(e => ({ public_name: e.users?.public_name, total_score: e.total_score, user_id: e.user_id }));

    } else if (period === 'weekly') {
      const weekStart = getWeekStart();
      const { data } = await supabase
        .from('leaderboard_weekly')
        .select('user_id, total_score, users(public_name)')
        .eq('week_start', weekStart)
        .order('total_score', { ascending: false })
        .limit(10);
      entries = (data || []).map(e => ({ public_name: e.users?.public_name, total_score: e.total_score, user_id: e.user_id }));

    } else {
      const { data } = await supabase
        .from('leaderboard_alltime')
        .select('user_id, total_score, users(public_name)')
        .order('total_score', { ascending: false })
        .limit(10);
      entries = (data || []).map(e => ({ public_name: e.users?.public_name, total_score: e.total_score, user_id: e.user_id }));
    }

    // Find caller's rank if they provided userId
    if (userId) {
      const idx = entries.findIndex(e => e.user_id === userId);
      if (idx >= 0) {
        userRank = idx + 1;
        userScore = entries[idx].total_score;
      }
    }

    res.json({
      period,
      entries: entries.map(e => ({ public_name: e.public_name, total_score: e.total_score })),
      user_rank: userRank,
      user_score: userScore,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// CHAT (basic — read and send messages)
// ============================================================

// GET /api/groups/:id/messages
app.get('/api/groups/:id/messages', async (req, res) => {
  try {
    const groupId = req.params.id;
    const limit = parseInt(req.query.limit) || 50;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, type, content, score_ref, sent_at, user_id, users(handle)')
      .eq('group_id', groupId)
      .order('sent_at', { ascending: true })
      .limit(limit);

    if (error) return res.status(500).json({ error: error.message });

    // Get reactions for these messages
    const msgIds = (messages || []).map(m => m.id);
    const { data: reactions } = msgIds.length > 0
      ? await supabase.from('message_reactions').select('message_id, user_id, reaction, users(handle)').in('message_id', msgIds)
      : { data: [] };

    const reactionMap = {};
    for (const r of (reactions || [])) {
      if (!reactionMap[r.message_id]) reactionMap[r.message_id] = {};
      if (!reactionMap[r.message_id][r.reaction]) reactionMap[r.message_id][r.reaction] = [];
      reactionMap[r.message_id][r.reaction].push(r.users?.handle || 'Unknown');
    }

    const result = (messages || []).map(m => ({
      id: m.id,
      type: m.type,
      content: m.content,
      score_ref: m.score_ref,
      sent_at: m.sent_at,
      author: m.users?.handle || 'Unknown',
      user_id: m.user_id,
      reactions: reactionMap[m.id] || {},
    }));

    res.json({ messages: result });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/groups/:id/messages
app.post('/api/groups/:id/messages', async (req, res) => {
  try {
    const groupId = req.params.id;
    const { userId, type, content, scoreRef } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const { data: msg, error } = await supabase
      .from('messages')
      .insert({
        group_id: groupId,
        user_id: userId,
        type: type || 'chat',
        content: content || null,
        score_ref: scoreRef || null,
      })
      .select('id, type, content, score_ref, sent_at')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: msg });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/messages/:id/reactions
app.post('/api/messages/:id/reactions', async (req, res) => {
  try {
    const messageId = req.params.id;
    const { userId, reaction } = req.body;
    if (!userId || !reaction) return res.status(400).json({ error: 'Missing userId or reaction' });

    // Toggle: if already reacted, remove; otherwise add
    const { data: existing } = await supabase
      .from('message_reactions')
      .select('message_id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('reaction', reaction)
      .maybeSingle();

    if (existing) {
      await supabase.from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('reaction', reaction);
      return res.json({ action: 'removed' });
    }

    await supabase.from('message_reactions').insert({ message_id: messageId, user_id: userId, reaction });
    res.json({ action: 'added' });
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// PROFILE
// ============================================================

// GET /api/profile?userId=xxx
app.get('/api/profile', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const { data: user, error } = await supabase
      .from('users')
      .select('id, handle, public_name, email, xp, streak, streak_last_day, dark_mode, colorblind_mode, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // Get badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', userId);

    // Get group count
    const { count: groupCount } = await supabase
      .from('group_members')
      .select('group_id', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get puzzle count
    const { count: puzzleCount } = await supabase
      .from('puzzle_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    res.json({
      ...user,
      badges: (badges || []).map(b => b.badge_id),
      group_count: groupCount || 0,
      puzzle_count: puzzleCount || 0,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PATCH /api/profile
app.patch('/api/profile', async (req, res) => {
  try {
    const { userId, handle, dark_mode, colorblind_mode } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const updates = {};
    if (handle !== undefined) updates.handle = handle.trim();
    if (dark_mode !== undefined) updates.dark_mode = dark_mode;
    if (colorblind_mode !== undefined) updates.colorblind_mode = colorblind_mode;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ user: data });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`uncl API running on port ${PORT}`);
});
