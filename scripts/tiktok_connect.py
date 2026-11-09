# TikTok connect (run once per TikTok account on your Mac). Standard library only.
# Prints a refresh token. Paste it into GitHub as TIKTOK_BODY_REFRESH_TOKEN. Nothing is saved to disk.
import hashlib, http.server, json, secrets, urllib.parse, urllib.request, webbrowser, getpass
KEY = input("TikTok Client key: ").strip()
SECRET = getpass.getpass("TikTok Client secret (hidden): ").strip()
REDIRECT = "http://localhost:8765/callback/"
verifier = secrets.token_urlsafe(64)
challenge = hashlib.sha256(verifier.encode()).hexdigest()      # TikTok desktop PKCE = hex SHA-256
state = secrets.token_urlsafe(16)
url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({
    "client_key": KEY, "response_type": "code", "redirect_uri": REDIRECT, "state": state,
    "scope": "user.info.basic,user.info.stats,video.list,video.upload,video.publish",
    "code_challenge": challenge, "code_challenge_method": "S256"})
got = {}
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        got.update({k: v[0] for k, v in q.items()})
        self.send_response(200); self.send_header("Content-Type", "text/html"); self.end_headers()
        self.wfile.write(b"<h2>Done. Go back to Terminal.</h2>")
    def log_message(self, *a): pass
print("\nOpening TikTok in your browser. Log in with the channel's TikTok account and tap Authorize.")
webbrowser.open(url)
http.server.HTTPServer(("localhost", 8765), H).handle_request()
if got.get("state") != state or "code" not in got:
    raise SystemExit(f"Login failed: {got.get('error_description') or got}")
body = urllib.parse.urlencode({"client_key": KEY, "client_secret": SECRET, "code": got["code"],
    "grant_type": "authorization_code", "redirect_uri": REDIRECT, "code_verifier": verifier}).encode()
req = urllib.request.Request("https://open.tiktokapis.com/v2/oauth/token/", data=body,
    headers={"Content-Type": "application/x-www-form-urlencoded"})
r = json.load(urllib.request.urlopen(req))
if "refresh_token" not in r:
    raise SystemExit(f"Token exchange failed: {r}")
print("\nGranted scopes:", r.get("scope"))
print("\nREFRESH TOKEN (put it in GitHub secret TIKTOK_BODY_REFRESH_TOKEN, then close this window):\n")
print(r["refresh_token"])
