import http.server
import socketserver
import json
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Path to the build artifacts
APK_PATH = os.path.join(DIRECTORY, "android/app/build/outputs/apk/release/app-release.apk")
VERSION_FILE = os.path.join(DIRECTORY, "version.json")

class UpdateHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/test-data':
            # Serve infinite dummy data for throughput testing
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.end_headers()
            chunk_size = 64 * 1024
            data = b'0' * chunk_size
            try:
                # Keep sending until the client closes the connection
                while True:
                    self.wfile.write(data)
            except BrokenPipeError:
                pass # Client stopped reading
        elif self.path == '/version.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            with open(VERSION_FILE, 'r') as f:
                self.wfile.write(f.read().encode())
        elif self.path == '/app-release.apk':
            if os.path.exists(APK_PATH):
                self.send_response(200)
                self.send_header('Content-type', 'application/vnd.android.package-archive')
                self.send_header('Content-Length', str(os.path.getsize(APK_PATH)))
                self.end_headers()
                with open(APK_PATH, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "APK not found. Please run the build script first.")
        else:
            self.send_error(404, "File not found")

if __name__ == "__main__":
    Handler = UpdateHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Update Server running at http://localhost:{PORT}")
        print(f"Serving APK from: {APK_PATH}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
