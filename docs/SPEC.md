# Design Tutor — Design Screenshot to React Tutorial

## Overview

| Item | Value |
|------|-------|
| Product Name | Design Tutor |
| Target Users | Junior developers, design students, self-taught coders |
| Core Value | Turn any design screenshot into step-by-step React tutorial |
| URL | https://design-tutor.demo.densematrix.ai |

## Problem Statement

New developers often struggle with:
1. Looking at a design and not knowing where to start
2. Breaking down a complex UI into manageable components
3. Translating visual elements into code
4. Learning best practices for React component structure

## Solution

Upload a design screenshot (Figma, Sketch, or any UI mockup) and receive:
- Identified UI components
- Step-by-step implementation tutorial
- Code snippets with explanations
- Estimated difficulty and time

## Core Features

1. **Design Upload** — Drag & drop or click to upload any design image
2. **AI Analysis** — Vision model identifies components, layout, styling
3. **Tutorial Generation** — Personalized React tutorial with code
4. **Multi-language** — 7 languages supported (en, zh, ja, de, fr, ko, es)

## Technical Stack

- Frontend: React + Vite (TypeScript), Tailwind CSS
- Backend: Python FastAPI
- AI: Claude claude-sonnet-4-20250514 Vision via llm-proxy.densematrix.ai
- Deploy: Docker → langsheng (39.109.116.180)

## SEO Keywords

### Primary
- `figma to react tutorial`
- `design to code converter`
- `ui screenshot to react`

### Secondary
- `learn react from design`
- `figma to react code generator`
- `design implementation tutorial`

### Long-tail
- `how to convert figma design to react code`
- `figma to react tutorial for beginners`
- `ui design to react component`

## Port Allocation

- Frontend: 30190
- Backend: 30191

## Completion Criteria

- [x] Upload and analyze design screenshots
- [x] Generate step-by-step React tutorials
- [x] 7 language support
- [ ] Deploy to design-tutor.demo.densematrix.ai
- [ ] Health check passing
