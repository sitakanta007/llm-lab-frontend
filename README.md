# 🧪 LLM Lab – Frontend

A lightweight and modular frontend application to run and analyze LLM experiment outputs.  
Built with Next.js, Tailwind CSS, and Redux Toolkit — designed for clean architecture, quick experimentation, and clear visualization.

---

## 🚀 Features

- ✍️ Prompt input with adjustable model parameters  
- 🧮 Generate and view experiment results in real time  
- 📊 Visualization of key metrics through charts  
- 🆚 Compare multiple experiments side by side  
- 💾 Export results for offline analysis  
- 🌓 Dark/light mode toggle for better UX

---

## 🛠️ Tech Stack

- **Framework:** Next.js (React-based)  
- **Language:** JavaScript (JSX)  
- **Styling:** Tailwind CSS  
- **State Management:** Redux Toolkit  
- **API Client:** Axios  
- **Deployment:** Vercel + Amazon Route 53 (subdomain)

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/llm-lab-frontend.git

# 2. Navigate to the project directory
cd llm-lab-frontend

# 3. Install dependencies
npm install

# 4. Configure environment variables
# Example: NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000 in your browser

Recommended Node version: 18.x or above

🧭 Architecture Overview

API Layer: Modular Axios-based integration

Data Flow: Unidirectional via Redux store

Components: Organized by feature (Charts, Compare, Utils, Response, Home)

App Routing: Next.js App Router for clean and dynamic routes

Config: Centralized in config/paramsConfig.js

llm-lab-frontend/
├── api/
├── app/
├── components/
├── config/
├── hooks/
├── store/
├── styles/
└── ...

🧑‍💻 UI/UX Design Rationale

Clean, minimal interface with clear visual hierarchy

Responsive design using Tailwind utility classes

Intuitive interactions with sliders, tooltips, and modals

Dark/light theme toggle for accessibility

Focus on quick experimentation without friction

🚀 Deployment

Build using:

npm run build


Deploy to Vercel or similar hosting platform.

Configure custom subdomain using Amazon Route 53 if required.

Set environment variables securely in your hosting provider.

📝 Future Improvements

Enhanced comparison features (filters & sorting)

More advanced evaluation metrics

Persistent experiment storage with authentication

CI/CD pipeline integration for faster deployment