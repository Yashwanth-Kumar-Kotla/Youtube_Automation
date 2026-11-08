#!/usr/bin/env python3
"""Run ONCE per YouTube channel on your own computer (opens a browser).

  pip install google-auth-oauthlib
  python scripts/youtube_auth.py client_secret.json

Sign in and pick the channel (brand account) you want. Copy the printed refresh token into the
GitHub secret YT_KIDS_REFRESH_TOKEN / YT_MATURE_REFRESH_TOKEN / YT_VIRAL_REFRESH_TOKEN.
Set the OAuth consent screen to "In production". In "Testing" mode refresh tokens expire after 7 days.
"""
import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
flow = InstalledAppFlow.from_client_secrets_file(sys.argv[1] if len(sys.argv) > 1 else "client_secret.json", SCOPES)
creds = flow.run_local_server(port=0, prompt="consent", access_type="offline")
print("\nREFRESH TOKEN:\n" + creds.refresh_token)
print(f"\nYT_CLIENT_ID={creds.client_id}\nYT_CLIENT_SECRET=<from client_secret.json>")
