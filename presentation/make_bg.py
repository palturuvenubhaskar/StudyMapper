"""Generate the app's pastel aurora background as a slide image."""
import numpy as np
from PIL import Image

W, H = 2400, 1350
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# app --bg-root corners (light theme)
CORNERS = [
    ((0, 0), (125, 211, 252), 0.42),      # sky, top-left
    ((W, 0), (249, 168, 212), 0.42),      # pink, top-right
    ((W, H), (252, 211, 77), 0.40),       # amber, bottom-right
    ((0, H), (196, 181, 253), 0.42),      # violet, bottom-left
]

img = np.ones((H, W, 3), dtype=np.float32) * 255.0
maxd = 0.62 * max(W, H)
for (cx, cy), color, strength in CORNERS:
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    t = np.clip(1.0 - dist / maxd, 0.0, 1.0)
    a = (strength * t)[..., None]
    img = img * (1 - a) + np.array(color, dtype=np.float32) * a

# a whisper of centre brightness so cards sit cleanly
img = np.clip(img, 0, 255).astype(np.uint8)
Image.fromarray(img).save("assets/bg_aurora.jpg", quality=92, optimize=True)
print("saved assets/bg_aurora.jpg", W, H)
