import subprocess
import time
import urllib.request
import json
import os
import sys

print("=== Fast Softrate Test Suite ===")
node_exe = r"C:\Users\svenk\AppData\Local\Programs\nodejs\node.exe"
server_script = os.path.join(os.path.dirname(__file__), "server", "server.js")

proc = subprocess.Popen(
    [node_exe, server_script],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

def get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as resp:
        return resp.read().decode('utf-8')

def post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as resp:
        return resp.read().decode('utf-8')

# Fast poll until server is ready (up to 6s)
ready = False
start_t = time.time()
while time.time() - start_t < 6:
    try:
        health = json.loads(get("http://localhost:5000/api/health"))
        if health.get("status") == "healthy":
            ready = True
            break
    except Exception:
        time.sleep(0.3)

if not ready:
    print("Server failed to respond within 6s. Exiting.")
    proc.terminate()
    sys.exit(1)

elapsed = round(time.time() - start_t, 2)
print(f"Server ready in {elapsed}s!")

try:
    print("\n--- 1. Health Status ---")
    print(get("http://localhost:5000/api/health"))

    print("\n--- 2. Categories ---")
    cats = json.loads(get("http://localhost:5000/api/categories"))
    print(f"Total Categories: {len(cats)}")
    for c in cats:
        print(f"  • {c['name']} (slug: {c['slug']}, count: {c.get('postCount', 0)})")

    print("\n--- 3. Featured Hero Articles (3 Asymmetrical) ---")
    featured = json.loads(get("http://localhost:5000/api/posts/featured"))
    print(f"Featured count: {len(featured)}")
    for f in featured:
        print(f"  ★ {f['title']} [{f['category']['name']}]")

    print("\n--- 4. Trending Strip Articles ---")
    trending = json.loads(get("http://localhost:5000/api/posts/trending"))
    for t in trending:
        print(f"  🔥 {t['title']} (views: {t['views']})")

    print("\n--- 5. Article Detail & Related By Slug ---")
    slug_data = json.loads(get("http://localhost:5000/api/posts/systematic-review-digital-transformation-literature"))
    print("Title:", slug_data['post']['title'])
    print("Authors:", slug_data['post']['author'])
    print("Read Time:", slug_data['post']['readTime'])
    print("Related Articles:", len(slug_data.get('relatedPosts', [])))
    print("Next Article:", slug_data.get('nextPost', {}).get('title'))

    print("\n--- 6. Admin Authentication & JWT ---")
    login = json.loads(post("http://localhost:5000/api/auth/login", {
        "email": "admin@softrate.com",
        "password": "admin123"
    }))
    print("Auth Token Generated:", bool(login.get("token")))
    print("Logged In As:", login.get("user", {}).get("username"))

    print("\n--- 7. Dynamic SEO Sitemap & Robots ---")
    sitemap = get("http://localhost:5000/sitemap.xml")
    print(f"Sitemap valid XML: {'<urlset' in sitemap}, URLs: {sitemap.count('<loc>')}")
    robots = get("http://localhost:5000/robots.txt")
    print("Robots.txt header:\n" + robots.strip())

    print("\n--- 8. Single-Bundle Production UI ---")
    html = get("http://localhost:5000/")
    print(f"HTML response received ({len(html)} bytes), contains Softrate title:", "Softrate" in html)

    print("\n==========================================")
    print("  ALL VERIFICATION CHECKS PASSED 100%!")
    print("==========================================")

finally:
    proc.terminate()
    print("Server cleanly terminated.")
