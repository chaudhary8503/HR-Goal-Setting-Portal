# Quick Start Commands

## Running Locally

### Backend Server
```bash
cd "RAG-AWs-Maker-JBS/src"
python app.py
```
Runs on: `http://localhost:5000`

### Frontend Server
```bash
cd "jaffer-focus-metrics-portal"
npm run dev
```
Runs on: `http://localhost:8080`

### Login Credentials
- **Email:** `antech@gmail.com`
- **Password:** `antech123`

---

## Stopping Servers

### Windows PowerShell
```powershell
# Stop Python processes
Get-Process python | Stop-Process -Force

# Stop Node processes
Get-Process node | Stop-Process -Force
```

### Alternative (if above doesn't work)
Press `Ctrl+C` in each terminal window running the servers.

