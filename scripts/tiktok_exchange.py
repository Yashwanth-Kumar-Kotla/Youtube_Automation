# Swap the code from https://yashwanth-kumar-kotla.github.io/tiktok/callback for a TikTok refresh token.
# Run on your own computer: python3 scripts/tiktok_exchange.py   (standard library only, nothing saved to disk)
# The secret and the token are never written to a file; copy the token straight into the GitHub secret.
import getpass, json, urllib.parse, urllib.request

REDIRECT = "https://yashwanth-kumar-kotla.github.io/tiktok/callback"
KEY = input("TikTok Client key (same app you authorized): ").strip()
SECRET = getpass.getpass("TikTok Client secret (hidden): ").strip()
CODE = input("Code from the callback page: ").strip()
body = urllib.parse.urlencode({"client_key": KEY, "client_secret": SECRET, "code": CODE,
                               "grant_type": "authorization_code", "redirect_uri": REDIRECT}).encode()
req = urllib.request.Request("https://open.tiktokapis.com/v2/oauth/token/", data=body,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
try:
    r = json.load(urllib.request.urlopen(req))
except urllib.error.HTTPError as e:
    raise SystemExit(f"Token exchange failed: HTTP {e.code} {e.read()[:300]!r}")
if "refresh_token" not in r:
    raise SystemExit(f"Token exchange failed: {r.get('error')} {r.get('error_description')}")
print("\nGranted scopes:", r.get("scope"))
print("Open ID:", r.get("open_id"))
print("\nREFRESH TOKEN (copy it into the GitHub secret, then clear this window):\n")
print(r["refresh_token"])
