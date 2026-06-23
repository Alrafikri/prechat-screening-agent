# Asisten Anamnesis AI

An AI-powered medical screening triage tool for conducting initial patient interviews (anamnesis), recording symptoms, and generating draft SOAP-format medical records.

**[Live Demo](https://alrafikri.github.io/prechat-screening-agent/)**

## Features

- **Setup** — Connect with your own OpenRouter API key, pick a model (free options available)
- **Patient Chat** — AI "virtual nurse" conducts structured anamnesis in Indonesian
- **Symptom Tracking** — Symptoms are automatically recorded and summarized
- **Doctor View** — Review symptom summary, edit SOAP note, see specialist recommendation
- **Privacy-First** — API key stored only in localStorage, all requests go directly to OpenRouter

## Tech Stack

- **Frontend:** React 19, Vite 8
- **AI:** OpenRouter API (OpenAI-compatible)
- **Testing:** Vitest + Testing Library
- **Styling:** Inline styles (zero framework)

## Quick Start

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Get a free API key at [OpenRouter](https://openrouter.ai)
5. Start a screening session

Free models available: `openrouter/free` (auto-router), `openai/gpt-oss-20b:free`, `google/gemma-4-31b-it:free`

## Development

```bash
npm run dev      # start dev server
npm run build    # production build
npm run test     # run tests
npm run preview  # preview production build
```
