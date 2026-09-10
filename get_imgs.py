import urllib.request
import re

url = "https://vasadescartables.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = set(re.findall(r'src=["\'](https://vasadescartables.com/[^"\']+\.jpg)["\']', html))
    for i, img in enumerate(list(imgs)[:8]):
        print(f"IMG {i}: {img}")
except Exception as e:
    print("Error:", e)
