"""Hand-authored sample script so the renderer can be tested without an API key."""
import json, math, os
def P(*xy): return [{"x": int(x), "y": int(y)} for x, y in xy]
def S(kind, pts, text="", color="ink", fill="none", width="normal"):
    return {"kind": kind, "points": P(*pts), "text": text, "color": color, "fill": fill, "width": width}
def circ(cx, cy, r, **k): return S("circle", [(cx-r, cy-r), (cx+r, cy+r)], **k)
def face(cx, cy, r, mood="happy"):
    out = [circ(cx, cy, r, fill="skin"), circ(cx-r*.35, cy-r*.15, r*.09, fill="gray"), circ(cx+r*.35, cy-r*.15, r*.09, fill="gray")]
    if mood == "happy": out.append(S("curve", [(cx-r*.4, cy+r*.3), (cx, cy+r*.55), (cx+r*.4, cy+r*.3)]))
    elif mood == "ouch": out.append(circ(cx, cy+r*.4, r*.15, fill="red"))
    else: out.append(S("curve", [(cx-r*.4, cy+r*.5), (cx, cy+r*.3), (cx+r*.4, cy+r*.5)]))
    return out
def fist(x, y, s=1.0, hurt=False):
    k = lambda a, b: (x + a*s, y + b*s)
    out = [S("rect", [k(0, 60), k(300, 260)], fill="red" if hurt else "skin", width="bold")]
    for i in range(4):
        out.append(S("ellipse", [k(i*75, 0), k(i*75+75, 90)], fill="red" if hurt else "skin"))
    out.append(S("curve", [k(0, 150), k(-40, 200), k(40, 240), k(180, 230)], width="bold"))
    return out
scenes = []
scenes.append({"narration": "What actually happens when you break your knuckle? It's not the bone you think, and the healing part is super weird.",
  "on_screen_title": "OUCH!", "strokes": fist(330, 330, 1.1) + [
    S("line", [(700, 260), (760, 200)], color="red", width="bold"), S("line", [(720, 320), (810, 300)], color="red", width="bold"),
    S("line", [(640, 230), (650, 150)], color="red", width="bold"), S("text", [(500, 760)], "KNUCKLE?", color="red")]})
scenes.append({"narration": "Your knuckles are joints, the bendy spots where your finger bones meet the long bones in your hand.",
  "on_screen_title": "INSIDE YOUR HAND", "strokes": [
    S("rect", [(440, 120), (560, 260)], fill="white"), S("rect", [(440, 290), (560, 440)], fill="white"),
    S("rect", [(430, 520), (570, 860)], fill="white"),
    circ(500, 275, 22, color="blue", fill="blue"), circ(500, 480, 34, color="blue", fill="blue"),
    S("arrow", [(200, 600), (300, 530), (450, 485)], color="red", width="bold"),
    S("text", [(200, 660)], "KNUCKLE", color="red"), S("text", [(790, 700)], "HAND BONE", color="blue"),
    S("arrow", [(780, 650), (590, 690)], color="blue")]})
scenes.append({"narration": "Most broken knuckles happen from punching something hard, like a wall. Doctors even call it a boxer's fracture.",
  "on_screen_title": "BOXER'S FRACTURE", "strokes": [
    S("rect", [(700, 120), (900, 880)], fill="orange", width="bold"),
    S("line", [(700, 320), (900, 320)]), S("line", [(700, 520), (900, 520)]), S("line", [(700, 720), (900, 720)]),
    S("line", [(800, 120), (800, 320)]), S("line", [(780, 520), (780, 720)]),
  ] + fist(260, 380, 1.2) + [
    S("line", [(120, 470), (40, 470)], color="gray"), S("line", [(140, 560), (60, 560)], color="gray"),
    S("line", [(670, 400), (630, 450), (660, 500), (620, 560)], color="red", width="bold")]})
scenes.append({"narration": "Then your hand swells up like a balloon, it turns purple, and making a fist really, really hurts.",
  "on_screen_title": "SWELLING", "strokes": face(260, 300, 140, "ouch") + [
    S("ellipse", [(480, 420), (900, 800)], fill="purple", width="bold"),
    S("ellipse", [(540, 340), (620, 470)], fill="purple"), S("ellipse", [(620, 330), (700, 460)], fill="purple"),
    S("ellipse", [(700, 340), (780, 470)], fill="purple"), S("ellipse", [(780, 360), (860, 480)], fill="purple"),
    S("text", [(690, 880)], "PUFFY!", color="purple"), S("line", [(160, 560), (120, 640)], color="blue"),
    S("line", [(340, 560), (380, 640)], color="blue")]})
scenes.append({"narration": "So a grown-up takes you to a doctor, who uses an X-ray to see the crack inside the bone.",
  "on_screen_title": "X-RAY TIME", "strokes": [
    S("rect", [(380, 160), (900, 760)], fill="blue", width="bold"),
    S("rect", [(600, 220), (680, 420)], fill="white"), S("rect", [(590, 460), (690, 720)], fill="white"),
    S("line", [(600, 540), (640, 570), (620, 600), (690, 630)], color="red", width="bold"),
  ] + face(200, 300, 100) + [
    S("line", [(200, 400), (200, 700)], width="bold"), S("line", [(200, 480), (380, 420)], width="bold"),
    S("line", [(200, 700), (130, 860)], width="bold"), S("line", [(200, 700), (270, 860)], width="bold"),
    S("text", [(640, 830)], "CRACK!", color="red")]})
scenes.append({"narration": "But here's the weird part. Your body glues the bone back together with brand new bone, and in about six weeks, it's strong again.",
  "on_screen_title": "SELF-HEALING", "strokes": [
    S("rect", [(150, 420), (430, 520)], fill="white", width="bold"), S("rect", [(470, 420), (750, 520)], fill="white", width="bold"),
    S("ellipse", [(400, 380), (500, 560)], color="green", fill="green", width="bold"),
    S("arrow", [(450, 700), (450, 580)], color="green", width="bold"), S("text", [(450, 760)], "NEW BONE", color="green"),
    S("rect", [(780, 150), (950, 330)], fill="yellow"), S("text", [(865, 240)], "6 WKS"),
  ] + face(160, 220, 80)})
scenes.append({"narration": "So next time you feel like punching a wall, remember your knuckle would lose. And now you know why.",
  "on_screen_title": "", "strokes": face(500, 380, 190) + [
    S("curve", [(330, 650), (500, 600), (670, 650)], color="green", width="bold"),
    S("text", [(500, 760)], "PROTECT YOUR", color="blue"), S("text", [(500, 840)], "KNUCKLES!", color="blue")]})
script = {"topic": "What happens if you break your knuckle?", "hook_title": "What happens if you break your knuckle?",
  "youtube_title": "What Happens If You Break Your Knuckle? (Explained for Kids)",
  "description": "Ever wondered what happens inside your hand when you break a knuckle? Here's the whole story, from crack to healing! Subscribe for a new body science video every day.",
  "hashtags": ["bodyscience", "kidslearning", "science", "humanbody", "funfacts", "shorts"], "scenes": scenes}
json.dump(script, open(os.path.join(os.path.dirname(__file__), "kids.json"), "w"), indent=1)
print("ok", len(scenes))
