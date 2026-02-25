# Design Tutor

Upload any design screenshot (Figma, Sketch, or any UI mockup) and get a step-by-step React tutorial.

## Features

- 📸 **Upload Any Design** — Figma, Sketch, Adobe XD, or screenshots
- 🤖 **AI Analysis** — Identifies UI components, layout patterns, styling
- 📝 **Step-by-Step Tutorial** — Personalized React tutorial with code snippets
- 🌍 **7 Languages** — English, 中文, 日本語, Deutsch, Français, 한국어, Español

## Tech Stack

- **Frontend**: React + Vite (TypeScript), Tailwind CSS
- **Backend**: Python FastAPI
- **AI**: Claude claude-sonnet-4-20250514 Vision

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Deployment

```bash
docker compose up -d --build
```

## License

MIT
