#!/usr/bin/env python3
"""Run ONCE per TikTok account on your own computer.

  TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... python scripts/tiktok_auth.py

Requires a TikTok for Developers app with Login Kit + Content Posting API, scopes video.upload (draft mode)
and video.publish (direct mode), and redirect URI http://localhost:8765/callback registered on the app.
Copy the printed refresh token into TIKTOK_<CHANNEL>_REFRESH_TOKEN.
"""
import http.server, os, secrets, urllib.parse, webbrowser, requests, hashlib, base64

KEY, SECRET = os.environ["TIKTOK_CLIENT_KEY"], os.environ["TIKTOK_CLIENT_SECRET"]
REDIRECT = "http://localhost:8765/callback"
verifier = secrets.token_urlsafe(64)
challenge = hashlib.sha256(verifier.encode()).hexdigest()  # TikTok desktop PKCE uses hex SHA256
state = secrets.token_urlsafe(16)
url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({
    "client_key": KEY, "scope": "user.info.basic,video.upload,video.publish", "response_type": "code",
    "redirect_uri": REDIRECT, "state": state, "code_challenge": challenge, "code_challenge_method": "S256"})
code = {}

class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        code["v"] = q.get("code", [None])[0]
        self.send_response(200); self.end_headers(); self.wfile.write(b"Done. You can close this tab.")
    def log_message(self, *a): pass

print("Opening:", url); webbrowser.open(url)
http.server.HTTPServer(("localhost", 8765), H).handle_request()
r = requests.post("https://open.tiktokapis.com/v2/oauth/token/", data={
    "client_key": KEY, "client_secret": SECRET, "code": code["v"], "grant_type": "authorization_code",
    "redirect_uri": REDIRECT, "code_verifier": verifier}).json()
print("\nREFRESH TOKEN:\n" + r.get("refresh_token", str(r)))
