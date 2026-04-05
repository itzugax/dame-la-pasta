import http.server
import socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"  {args[0]} {args[1]}")

PORT = 8080
with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"\n  Servidor iniciado en http://localhost:{PORT}")
    print(f"  Admin: http://localhost:{PORT}/admin.html")
    print(f"  TV:    http://localhost:{PORT}/tv.html")
    print(f"\n  Ctrl+C para parar\n")
    httpd.serve_forever()
