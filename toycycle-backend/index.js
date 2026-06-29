require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/toys', require('./routes/toys'));
app.use('/posts', require('./routes/posts'));
app.use('/scan', require('./routes/scan'));

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT, () => {
  console.log(`ToyCycle backend running on port ${process.env.PORT}`);
});