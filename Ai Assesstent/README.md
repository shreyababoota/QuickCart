# QuickCart AI Decision Assist Chatbot

A quick-commerce chatbot that detects customer hesitation and triggers intelligent nudges using Claude AI.

## Nudge Types
| Type | Color | Trigger |
|------|-------|---------|
| 🎁 Bundle | Green | Cart has 1-2 items + related products exist |
| ⚖️ Compare | Blue | User mentions a product with a close competitor |
| 🔄 Substitute | Orange | Low stock (≤20) or high ETA (≥18 min) |
| 🔥 Social Proof | Purple | Indecisive user or general recommendations |

## Setup

### 1. Add your API key
Edit `.env` and replace `your_api_key_here` with your Anthropic API key.

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Run the app
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Try these prompts
- "I want breakfast"
- "add milk"
- "suggest something for evening snacks"
- "I need something to drink"
- "add bread"
- "what's popular right now?"

## Project Structure
```
/client       → React frontend (port 3000)
/server       → Express backend (port 3001)
  /routes     → chat.js (POST /api/chat)
/data         → products.json + user.json mock data
.env          → ANTHROPIC_API_KEY
```
