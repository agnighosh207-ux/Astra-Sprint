const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Groq } = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI SDKs
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_groq_key' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_gemini_key');

const PORT = process.env.PORT || 3000;

/**
 * Endpoint: /api/v1/generate-event
 * Payload: { userId, currentPace, avgPace, distance, biome, missionTheme }
 */
app.post('/api/v1/generate-event', async (req, res) => {
  const { userId, currentPace, avgPace, distance, biome, missionTheme } = req.body;

  try {
    let eventType = 'neutral';
    let prompt = '';
    let responseText = '';

    // 1. Logic Gate: Threat Event (Pace dropped by 15%)
    if (currentPace > avgPace * 1.15) { 
      eventType = 'threat';
      prompt = `You are a cyber-guide in a mythological cyberpunk world. The runner (Operative ${userId}) is slowing down in a ${biome} area. 
      In 15 words or less, warn them that the Rakshasa patrol is closing in. Mission Theme: ${missionTheme}. Be extremely urgent.`;
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: 'llama3-8b-8192',
      });
      responseText = chatCompletion.choices[0]?.message?.content;
    } 
    // 2. Logic Gate: Lore Event (Kilometer milestone - simple check for integer km)
    else if (Math.floor(distance) > Math.floor(distance - 0.01)) {
      eventType = 'lore';
      prompt = `You are a mythic chronicler. The operative has reached ${Math.floor(distance)}km in their journey through ${biome}. 
      Tell a brief, immersive piece of lore (under 30 words) about a hidden relic or a past battle in this area. Theme: ${missionTheme}.`;
      
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
    } 
    else {
      return res.json({ eventType: 'none', text: '' });
    }

    res.json({ eventType, text: responseText });

  } catch (error) {
    console.error('AI Processing Error:', error);
    res.status(500).json({ 
      eventType: 'error', 
      text: "Signal lost, keep running! Stay alert." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mission Controller running on port ${PORT}`);
});
