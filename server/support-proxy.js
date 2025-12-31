const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if(!OPENAI_KEY){
  console.warn('Warning: OPENAI_API_KEY not set. Set it in environment before running the server.');
}

app.post('/api/support', async (req, res) => {
  try{
    const { messages } = req.body;
    if(!messages) return res.status(400).json({ error: 'Missing messages in request body' });

    if(!OPENAI_KEY) return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });

    const payload = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800
    };

    const r = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      }
    });

    const data = r.data;
    const content = data.choices && data.choices[0] && (data.choices[0].message && data.choices[0].message.content) || null;
    return res.json({ result: content || data });
  }catch(err){
    console.error('Proxy error', err && err.response && err.response.data ? err.response.data : err.message || err);
    const message = err && err.response && err.response.data ? err.response.data : (err.message || 'Unknown error');
    return res.status(500).json({ error: typeof message === 'string' ? message : JSON.stringify(message) });
  }
});

app.listen(PORT, ()=> console.log(`Support proxy listening on http://localhost:${PORT}`));
