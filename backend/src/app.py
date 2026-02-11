from dotenv import load_dotenv
import os
load_dotenv()  # ✅ Load all .env variables early before anything else

from lib import create_app


app = create_app()

if __name__ == "__main__":
    # Force port 5000 for local development
    # When running via gunicorn (production), PORT env var will be used automatically
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)
