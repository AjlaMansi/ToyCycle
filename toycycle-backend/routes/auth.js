const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const ws = require("ws");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    realtime: { transport: ws },
  },
);

router.post("/register", async (req, res) => {
  const { email, password, full_name, city, phone } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, city, phone } },
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
