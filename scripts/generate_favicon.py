import os
import math
from PIL import Image, ImageDraw

os.makedirs('apps/web/public', exist_ok=True)
os.makedirs('apps/web/src/app', exist_ok=True)

# Generate SVG
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F1329" />
      <stop offset="100%" stop-color="#070914" />
    </linearGradient>
    <linearGradient id="orbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9366FF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background squircle -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" stroke="#9366FF" stroke-width="1" stroke-opacity="0.3" />
  
  <!-- Outer Orbit Ellipse -->
  <ellipse cx="32" cy="32" rx="22" ry="9" fill="none" stroke="url(#orbitGrad)" stroke-width="2.5" transform="rotate(-28 32 32)" filter="url(#glow)" />
  
  <!-- Planet on orbit -->
  <circle cx="49" cy="23" r="3.5" fill="#38BDF8" filter="url(#glow)" />
  
  <!-- Central Star / Planet -->
  <circle cx="32" cy="32" r="7" fill="url(#orbitGrad)" />
  <circle cx="30" cy="30" r="3" fill="#FFFFFF" fill-opacity="0.4" />
</svg>"""

with open('apps/web/public/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
with open('apps/web/src/app/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

def create_orbit_image(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rect
    corner = max(2, int(size * 0.25))
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner, fill=(12, 16, 36, 255), outline=(147, 102, 255, 120), width=max(1, int(size*0.03)))
    
    cx, cy = size / 2.0, size / 2.0
    
    # Central sphere
    cr = max(2.0, size * 0.16)
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(147, 102, 255, 255))
    # Core highlight
    hr = max(1.0, cr * 0.4)
    draw.ellipse([cx - cr*0.3 - hr, cy - cr*0.3 - hr, cx - cr*0.3 + hr, cy - cr*0.3 + hr], fill=(255, 255, 255, 180))
    
    # Orbit ring points (rotated ellipse)
    angle = -math.radians(28)
    cos_a, sin_a = math.cos(angle), math.sin(angle)
    rx, ry = size * 0.38, size * 0.16
    
    points = []
    num_pts = 64
    for i in range(num_pts):
        theta = 2 * math.pi * i / num_pts
        x0 = rx * math.cos(theta)
        y0 = ry * math.sin(theta)
        # rotate
        xr = x0 * cos_a - y0 * sin_a + cx
        yr = x0 * sin_a + y0 * cos_a + cy
        points.append((xr, yr))
        
    for i in range(len(points)):
        p1 = points[i]
        p2 = points[(i + 1) % len(points)]
        t = i / len(points)
        r = int(147 * (1 - t) + 56 * t)
        g = int(102 * (1 - t) + 189 * t)
        b = int(255 * (1 - t) + 248 * t)
        draw.line([p1, p2], fill=(r, g, b, 230), width=max(1, int(size * 0.06)))
        
    # Satellite
    sat_idx = int(num_pts * 0.15)
    sx, sy = points[sat_idx]
    sr = max(1.5, size * 0.08)
    draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(56, 189, 248, 255))
    
    return img

sizes = [16, 32, 48, 64]
imgs = [create_orbit_image(s) for s in sizes]
# Save multi-size favicon.ico
imgs[0].save('apps/web/public/favicon.ico', format='ICO', sizes=[(s, s) for s in sizes], append_images=imgs[1:])
imgs[0].save('apps/web/src/app/favicon.ico', format='ICO', sizes=[(s, s) for s in sizes], append_images=imgs[1:])

# Save apple-icon.png (180x180)
apple_img = create_orbit_image(180)
apple_img.save('apps/web/public/apple-touch-icon.png', format='PNG')
apple_img.save('apps/web/src/app/apple-icon.png', format='PNG')
print('Favicons generated successfully!')
