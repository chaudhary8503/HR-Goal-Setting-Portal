from dotenv import load_dotenv
import os
load_dotenv()  # ✅ Load all .env variables early before anything else

from lib import create_app


app = create_app()

if __name__ == "__main__":
    # For local development: use port 5000
    # For production (Railway): use PORT environment variable
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
