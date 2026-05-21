import urllib.request
import urllib.error
import json
import sys

url = 'http://localhost:8000/math/mcq/generate'
data = {'chapter_id': 3, 'count': 2}
req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as res:
        raw_body = res.read().decode('utf-8')
        print("SUCCESS! Response length:", len(raw_body))
        # Write to file with utf-8 encoding to avoid Windows console errors
        with open('response.json', 'w', encoding='utf-8') as f:
            f.write(raw_body)
        print("Response saved to response.json")
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("ERROR:", str(e))
