Conversational vs. Traditional Search Evaluation – Research Prototype

This project is a research prototype developed to evaluate user satisfaction and effectiveness in conversational (AI-based) versus traditional (keyword-based) search engines. It allows users to perform side-by-side searches and compare the experience between LINKS and CONVERSATIONS, including the quality of answers and overall satisfaction with each method.

The prototype uses OpenAI's API to power to represent results.

Purpose:

1)  Explore the qualitative and quantitative differences in user experience.
  
2)  Measure perceived relevance, accuracy, and usability.
  
3)  Support usability testing, A/B testing, or academic research in HCI, NLP, or information retrieval.

Technologies: 

Frontend: React.js + Tailwind CSS, Google tag management

Backend (optional): Node.js / Express, Firebas

AI Engine: OpenAI GPT-4 (via OpenAI API)


Deployment (optional): Vercel / Netlify
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


**AUTHENTICATION KEY FOR OPEN AI: 
**

1) Create a .env at the root of your project
2) Add line NEXT_PUBLIC_OPENAI_API_KEY={enter your key here}


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
