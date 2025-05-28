# Conversational Search Interface Evaluation

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **A research prototype for evaluating user experience between link-based and AI-powered conversational responses within a unified GPT-based system.**
>
> Built with **Next.js (React)**, **Tailwind CSS**, and **OpenAI GPT‑4**, this tool helps researchers compare relevance, satisfaction, and usability between traditional-looking link outputs and direct natural language responses.

---

## ✨ About the thesis:

* **Understand search modes** – Explore user experience differences between link suggestion and full-text conversational answers.
* **Research‑ready** – Designed for usability studies, A/B tests, HCI & IR coursework, or rapid prototyping inside product teams.
* **Single engine, dual modes** – Both panels are powered by GPT‑4, showing its versatility in generating structured (links) and unstructured (conversation) results.

---

## 📐 Key Features

| Area                  | Highlights                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Dual Interface**    | Side‑by‑side GPT-driven output: curated links vs. direct conversation.                                                |
| **Inline Evaluation** | After each query, users rate relevance, accuracy, helpfulness & UX on a 5‑point scale.                                |
| **Session Analytics** | Client‑side events shipped via Google Tag Manager. Optional Node/Firebase backend stores anonymised interaction logs. |
| **Model A/B Switch**  | Drop in alternative LLMs (Anthropic, Azure OpenAI, local models) by editing one adapter.                              |
| **Deploy in seconds** | Works out‑of‑the‑box on Vercel/Netlify; no server setup required for basic use.                                       |

> **Screenshot / GIF Placeholder** – Add a `demo.gif` here to showcase the interface.

---

## 🛠 Tech Stack

### Frontend

* **Next.js 14 (App Router)**
* **React 18 + TypeScript**
* **Tailwind CSS**
* **React Material UI** – for enhanced design and layout
* **Headless UI** (modal & radio groups)
* **Google Tag Manager** (event tracking)

### Backend (optional)

* **Node.js / Express**
* **Firebase (Firestore + Hosting)**

### AI‑Engine

* **OpenAI GPT‑4** *(default)* — answers generated via [OpenAI API](https://platform.openai.com/).

---

## 🎛 Interface Overview

In this thesis, we have developed a demo project interface using React TypeScript
with Next.js and Tailwind CSS for styling. The interface integrates OpenAI for conversational capabilities. Additionally, we have incorporated various libraries,
including React Material UI, to enhance the user interface and overall design aesthetics.

The conversational search engine demo is split into two GPT-powered experiences:

* **Link-Based Assistant (Left Panel):** This panel offers a list of suggested hyperlinks based on the input query. It mirrors the functionality of early AI assistant models or search engine support modules, emphasizing user-led exploration. Each link is curated based on relevance and directs the user to external resources.

* **Conversational Assistant (Right Panel):** This panel uses AI-driven natural language responses to generate a comprehensive, coherent, and contextualized summary based on the user input.

---

## 🚀 Getting Started

```bash
# 1 – Install dependencies
npm install         # fastest
# or
yarn install         # or npm install

# 2 – Start the dev server
pnpm dev             # or npm run dev / yarn dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot‑reloads as you edit `app/page.tsx` (thanks to Next.js Fast Refresh).

### Environment Variables

Create a `.env` file at the project root:

```dotenv
# .env
NEXT_PUBLIC_OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
```

> 🔑 **Your API key is required for all GPT-driven results.** The left and right panels both use GPT‑4 — only the output style differs.

---

## 📊 Evaluation Workflow

1. **Recruit participants** – Internal team, classroom, or crowdsourced testers.
2. **Define tasks** – Provide realistic search questions (fact‑finding, exploratory, transactional, etc.).
3. **Collect ratings & logs** – Responses are stored client‑side or posted to your backend endpoint.
4. **Analyse** – Import the CSV/JSON logs into R/Python to compute mean Likert scores, completion time, and satisfaction deltas.

See the `/docs/evaluation-template.ipynb` notebook for an example analysis pipeline.

---

## 📁 Project Structure

```text
└─ src/
   ├─ app/            # Next.js pages & layouts
   ├─ components/     # Reusable UI atoms & molecules
   ├─ lib/            # API utilities & model adapters
   ├─ hooks/          # Custom React hooks (state, analytics)
   └─ styles/         # Tailwind config & globals.css
```

---

## ☁️ Deployment

The prototype is frontend‑only by default, so you can deploy in **one click**:

1. **Vercel** – `<https://vercel.com/new>` → import repo → set `NEXT_PUBLIC_OPENAI_API_KEY` → deploy.
2. **Netlify** – Connect repo → *Site settings* → Environment → add API key → deploy.

For the optional Node/Firebase backend, see `/server/README.md`.

---

## 🗺️ Roadmap

* [ ] Prompt library for domain‑specific tasks
* [ ] In‑context citations & sources
* [ ] Multi‑turn conversational memory
* [ ] Real‑time cost dashboard (tokens & \$)
* [ ] Plug‑in vector‑based re‑ranker

Contributions welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 🤝 Contributing

1. Fork the repo & create your branch: `git checkout -b feature/my‑feature`.
2. Commit changes: `git commit -m "feat: add …"`.
3. Push to the branch: `git push origin feature/my‑feature`.
4. Open a Pull Request.

Please follow the [Commit Convention](https://www.conventionalcommits.org/) and run `pnpm lint` before pushing.

---


## 🙏 Acknowledgements

* [OpenAI](https://openai.com) for GPT‑4.
* [Vercel](https://vercel.com) for Next.js & hosting.
* [Tailwind Labs](https://tailwindcss.com) for Tailwind CSS.

---

*Happy researching!*
