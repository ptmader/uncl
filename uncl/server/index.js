import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate a random 6-char group code (e.g., "ABC-1234")
function generateGroupCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return code;
}

// Generate a random public name (e.g., "swift-ember-falcon")
function generatePublicName() {
  const adjectives = ['swift', 'bold', 'calm', 'sharp', 'bright', 'quick', 'wild', 'wise'];
  const nouns = ['ember', 'falcon', 'tiger', 'eagle', 'wolf', 'bear', 'lion', 'dragon'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}-${noun}-${num}`;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// AUTH ROUTES
// ============================================

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, handle } = req.body;

    if (!email || !password || !handle) {
      return res.status(400).json({ error: 'Missing email, password, or handle' });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;
    const publicName = generatePublicName();

    // Create user profile
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        handle,
        public_name: publicName,
        auth_provider: 'email',
      });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    res.json({
      user: {
        id: userId,
        email,
        handle,
        public_name: publicName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUZZLE ROUTES
// ============================================

// GET /api/puzzle/today
app.get('/api/puzzle/today', async (req, res) => {
  try {
    // Get today's puzzle
    const today = new Date().toISOString().split('T')[0];
    
    const { data: puzzle, error: puzzleError } = await supabase
      .from('puzzles')
      .select('*')
      .eq('scheduled_date', today)
      .single();

    if (puzzleError || !puzzle) {
      return res.status(404).json({ error: 'No puzzle for today' });
    }

    // Get questions for this puzzle (answers NOT sent to client)
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, position, type, question, options, time_limit')
      .eq('puzzle_id', puzzle.id)
      .eq('mode', 'normal')
      .order('position', { ascending: true });

    if (questionsError) {
      return res.status(500).json({ error: questionsError.message });
    }

    res.json({
      puzzle: {
        id: puzzle.id,
        theme: puzzle.theme,
        day_of_week: puzzle.day_of_week,
      },
      questions,
    });
  } catch (error) {
    console.error('Puzzle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/puzzle/submit
app.post('/api/puzzle/submit', async (req, res) => {
  try {
    const { userId, puzzleId, answers, timeTakenMs } = req.body;

    if (!userId || !puzzleId || !answers) {
      return res.status(400).json({ error: 'Missing userId, puzzleId, or answers' });
    }

    // Get all questions for this puzzle with answers
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, answer, aliases, position')
      .eq('puzzle_id', puzzleId)
      .eq('mode', 'normal');

    if (questionsError || !questions) {
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    // Score the submission
    let correctCount = 0;
    let score = 0;
    const breakdown = [];

    for (const question of questions) {
      const userAnswer = answers[question.id] || '';
      const correct = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

      if (correct) {
        correctCount++;
        score += 100; // 100 points per correct answer
      }

      breakdown.push({
        question_id: question.id,
        correct,
        points: correct ? 100 : 0,
      });
    }

    // Save attempt to database
    const { data: attempt, error: attemptError } = await supabase
      .from('puzzle_attempts')
      .insert({
        user_id: userId,
        puzzle_id: puzzleId,
        mode: 'normal',
        score,
        correct_count: correctCount,
        total_questions: questions.length,
        time_taken_ms: timeTakenMs,
        breakdown: JSON.stringify(breakdown),
      })
      .select()
      .single();

    if (attemptError) {
      return res.status(400).json({ error: attemptError.message });
    }

    res.json({
      score,
      correct_count: correctCount,
      total_questions: questions.length,
      breakdown,
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// GROUP ROUTES
// ============================================

// GET /api/groups - List user's groups
app.get('/api/groups', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'No user ID provided' });
    }

    const { data: groups, error } = await supabase
      .from('group_members')
      .select('group:groups(*)')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(groups.map(g => g.group));
  } catch (error) {
    console.error('Groups fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/groups - Create a new group
app.post('/api/groups', async (req, res) => {
  try {
    const { userId, groupName } = req.body;

    if (!userId || !groupName) {
      return res.status(400).json({ error: 'Missing userId or groupName' });
    }

    const code = generateGroupCode();

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: groupName,
        code,
        creator_id: userId,
      })
      .select()
      .single();

    if (groupError) {
      return res.status(400).json({ error: groupError.message });
    }

    // Add creator to group
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
      });

    if (memberError) {
      return res.status(400).json({ error: memberError.message });
    }

    res.json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/groups/join - Join a group by code
app.post('/api/groups/join', async (req, res) => {
  try {
    const { userId, groupCode } = req.body;

    if (!userId || !groupCode) {
      return res.status(400).json({ error: 'Missing userId or groupCode' });
    }

    // Find group by code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('code', groupCode)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Add user to group
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
      });

    if (memberError) {
      return res.status(400).json({ error: memberError.message });
    }

    res.json(group);
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// LEADERBOARD ROUTES
// ============================================

// GET /api/leaderboard/global - Get global leaderboard
app.get('/api/leaderboard/global', async (req, res) => {
  try {
    const period = req.query.period || 'daily'; // daily, weekly, alltime

    let tableName;
    if (period === 'daily') {
      tableName = 'leaderboard_daily';
    } else if (period === 'weekly') {
      tableName = 'leaderboard_weekly';
    } else {
      tableName = 'leaderboard_alltime';
    }

    // Get top 10
    const { data: scores, error } = await supabase
      .from(tableName)
      .select('user_id, total_score, users(public_name)')
      .order('total_score', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1,
      public_name: entry.users?.public_name || 'Unknown',
      score: entry.total_score,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Trivia Daily API running on port ${PORT}`);
});
