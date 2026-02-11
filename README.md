# OKR Management Platform

A full-stack web application for managing Objectives and Key Results (OKRs) with AI-powered SMART goal generation. Built with React, TypeScript, Flask, and Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5-blue.svg)

## 🎯 Overview

This platform helps organizations and teams set, track, and achieve their objectives through structured OKR management. The system uses AI to automatically generate SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals based on user input, ensuring alignment with company values and strategic frameworks.

## ✨ Features

- **AI-Powered Goal Generation**: Automatically generates 3 SMART goals using Google Gemini AI
- **OKR Management**: Define objectives, key results, and track progress
- **Company Alignment**: Goals are aligned with company values, strategic frameworks, and top bets
- **KPI Scoring System**: Built-in 5-point KPI scoring system for performance evaluation
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **JWT Authentication**: Secure authentication with JSON Web Tokens
- **Goal Editing**: Edit and refine generated goals with AI assistance
- **Export Functionality**: Export goals and results for documentation

## 🏗️ Architecture

### Frontend (`jaffer-focus-metrics-portal/`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router

### Backend (`RAG-AWs-Maker-JBS/`)
- **Framework**: Flask (Python)
- **AI Integration**: Google Gemini AI via LangChain
- **Authentication**: JWT tokens
- **API**: RESTful API design
- **Deployment**: Gunicorn with WSGI

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo>
   ```

2. **Backend Setup**
   ```bash
   cd RAG-AWs-Maker-JBS/src
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd jaffer-focus-metrics-portal
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in `RAG-AWs-Maker-JBS/`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET_KEY=your_jwt_secret_key_here
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd RAG-AWs-Maker-JBS/src
python app.py
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd jaffer-focus-metrics-portal
npm run dev
```
Frontend runs on `http://localhost:8080`

### Demo Credentials
- **Email**: `antech@gmail.com`
- **Password**: `antech123`

## 📖 Usage

1. **Login** with the demo credentials
2. **Fill out the OKR form** with:
   - Job Title
   - Department
   - Goal Description
   - Key Results
   - Due Date
   - Manager's Goal (optional)
3. **Submit** to generate 3 AI-powered SMART goals
4. **Review and edit** goals as needed
5. **Export** results for documentation

## 🛠️ Tech Stack

### Frontend
- React 18.3
- TypeScript 5.5
- Vite 5.4
- Tailwind CSS 3.4
- Radix UI
- Axios
- React Router
- React Hook Form
- Zod (validation)

### Backend
- Python 3.11
- Flask
- LangChain
- Google Gemini AI
- JWT (PyJWT)
- Flask-CORS
- Gunicorn

## 📁 Project Structure

```
.
├── jaffer-focus-metrics-portal/    # Frontend React app
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                 # Page components
│   │   ├── lib/                   # Utilities and API clients
│   │   └── types/                 # TypeScript type definitions
│   ├── public/                    # Static assets
│   └── package.json
│
├── RAG-AWs-Maker-JBS/             # Backend Flask API
│   ├── src/
│   │   ├── app.py                 # Application entry point
│   │   ├── lib/
│   │   │   ├── api/               # API routes and business logic
│   │   │   ├── utils/             # Utilities and prompts
│   │   │   └── db/                # Database connections
│   │   └── wsgi.py                # WSGI entry point
│   ├── requirements.txt
│   └── Procfile                   # Railway deployment config
│
├── DEPLOYMENT.md                   # Deployment guide
└── README.md                       # This file
```

## 🌐 Deployment

### Railway (Backend)
1. Create a new Railway project
2. Set root directory to `RAG-AWs-Maker-JBS`
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET_KEY`
4. Deploy!

### Vercel/Netlify (Frontend)
1. Connect your GitHub repository
2. Set root directory to `jaffer-focus-metrics-portal`
3. Add environment variable:
   - `VITE_API_BASE_URL` (your Railway backend URL)
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/protected` - Protected route example

### Goals
- `POST /api/generate-smart-goals` - Generate SMART goals
- `POST /api/save-user-goal` - Save a goal
- `POST /api/edit-user-goal` - Edit a goal

### Health
- `GET /api/health` - API health check

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for goal generation
- LangChain for AI orchestration
- Radix UI for accessible components
- Tailwind CSS for styling

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a portfolio project. Demo credentials are provided for testing purposes.

