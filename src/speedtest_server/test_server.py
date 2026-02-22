import urllib.request
import urllib.error
import json

def test_endpoint(url):
    print(f"Testing {url}...")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"Status: {response.status}")
            print(f"Response: {json.dumps(data, indent=2)}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        try:
            data = json.loads(e.read().decode('utf-8'))
            print(f"Response: {json.dumps(data, indent=2)}")
        except:
            print(f"Response: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"Connection Error: {e.reason}")
    print("-" * 40)

def main():
    base_url = "http://localhost:8081"
    
    # 1. Health check
    test_endpoint(f"{base_url}/health")
    
    # 2. Default speedtest (ookla)
    test_endpoint(f"{base_url}/speedtest")
    
    # 3. Cloudflare speedtest
    test_endpoint(f"{base_url}/speedtest?tool=cloudflare")
    
    # 4. Unknown tool speedtest
    test_endpoint(f"{base_url}/speedtest?tool=nonexistent")

if __name__ == "__main__":
    main()
