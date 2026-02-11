.# SMART Goals Generator API

A modular, scalable Flask API for generating SMART goals using Google Gemini AI and LangChain. Designed for easy integration with a React frontend and secure authentication.

---

## 🚀 Features
- **Generate SMART Goals**: AI-powered, company-aligned, and department-specific.
- **Authentication**: JWT-based login, registration, and protected routes.
- **Modular Structure**: Clean separation of API, authentication, and business logic.
- **Prompt Management**: Loads prompt templates for tailored goal generation.
- **Cross-platform**: Works on Windows, Mac, and Linux.

---

## 🗂️ Project Structure
```
.
├── src/
│   ├── app.py              # App entry point
│   ├── lib/
│   │   ├── __init__.py     # App factory
│   │   ├── config.py       # Config
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py   # All API endpoints
│   │   │   └── smart_goals.py # SMARTGoalsGenerator class
│   │   └── utils/
│   │       ├── auth.py     # Auth helpers
│   │       └── prompts.json# Prompt templates
│   └── ...
├── requirements.txt
├── Makefile                # (Optional) For Unix-like systems
├── tasks.py                # Invoke tasks (cross-platform)
└── README.md
```

---

## ⚡ Quick Start

### 1. **Clone the repository**
```sh
git clone <your-repo-url>
cd <your-repo>
```

### 2. **Install dependencies**
```sh
pip install -r requirements.txt
```
Or, using Invoke:
```sh
invoke install
```

### 3. **Set up environment variables**
Create a `.env` file in the root or `src/` directory with:
```
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret
user=your_db_user
password=your_db_password
host=your_db_host
port=your_db_port
dbname=your_db_name
```

### 4. **Run the app**
- **From project root:**
  - With Python:
    ```sh
    python src/app.py
    ```
  - Or, with Invoke (cross-platform):
    ```sh
    invoke run
    ```

---

## 🛠️ Available Tasks
- `invoke install` — Install dependencies
- `invoke run` — Run the app
    (TO BE ADDED)
- `invoke test` — Run tests (if you add them)
- `invoke lint` — Lint code with flake8
- `invoke format` — Format code with black
- `invoke clean` — Remove Python cache files
- `invoke freeze` — Update requirements.txt

---

## 🔒 Authentication
- **Login:** `POST /api/auth/login` with JSON `{ "email": ..., "password": ... }`
- **Register:** `POST /api/auth/register`
- **Protected routes:** Use the JWT token in the `Authorization: Bearer <token>` header.
- **Test Auth:** Use `python test_auth.py [email] [password]` to test authentication flow
- **More Info:** See `AUTH_TESTING.md` for detailed testing instructions

The authentication system uses JWT tokens that expire after 24 hours. Protected endpoints are
secured with the `@login_required` decorator, which verifies the token and sets the user
information in Flask's `g` object for the duration of the request.

Example authentication flow:
1. Client logs in with credentials
2. Server returns JWT token
3. Client includes token in Authorization header for subsequent requests
4. Server validates token for protected endpoints

---

## 🎯 API Usage Example
**Generate SMART Goals:**
```http
POST /api/generate-smart-goals
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "jobTitle": "Software Engineer",
  "department": "IT",
  "goalDescription": "Improve system reliability",
  "keyResult": "99.9% uptime",
  "dueDate": "2025-12-31"
}
```
**Response:**
```json
{
  "success": true,
  "goals": [
    { "title": ..., "description": ..., ... },
    ...
  ]
}
```

---

## 🧩 Contributing
1. Fork the repo and create your branch.
2. Add your feature or fix.
3. Run `invoke lint` and `invoke test`.
4. Submit a pull request!

---

## 📚 Notes
- Prompts are loaded from `src/lib/utils/prompts.json` after login and included in the login response.
- The app is modular: all business logic, routes, and helpers are separated for maintainability.
- For Windows users, use `invoke` or a `.bat` file if you don't have `make`.

---

## 📞 Support
For questions or help, open an issue or contact the maintainer. 
