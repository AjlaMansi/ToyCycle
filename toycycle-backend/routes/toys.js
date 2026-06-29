const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  realtime: { transport: ws }
});

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('toys').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('toys').insert(req.body).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;