# Discord Message System
This project is my attempt to understand the Discord Gateway, and utilize it.

## Setup
Create a `.env` file with the following items:
```
API_ENDPOINT = "https://discord.com/api"
CLIENT_ID = "your_app_id"
CLIENT_SECRET = "your_app_secret"
REDIRECT_URI = "your_app_redirect"
CODE_URI = "your_authorize_oauth_uri"
```

## Usage

Server will start at `localhost:8020`. To login, go to `localhost:8020/login`, which is a direct to your `CODE_URI`. This should redirect you back to homepage, and the websocket server will begin to connect.
"# discord-gateway" 
