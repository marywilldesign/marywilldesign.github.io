# preview the site on this computer, with the same web addresses it has live.
# the repo keeps case studies in projects/ and the about page in pages/, but online they sit
# at the top (marywildesign.com/telus/), so this server looks in those folders too.
# usage, from the repo folder:  python3 .github/preview.py   then open http://localhost:8000
import http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
LIFTED = ('pages', 'projects')   # folders whose contents are served one level up


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        # try the address as it is first, then inside pages/ and projects/
        direct = super().translate_path(path)
        if os.path.exists(direct):
            return direct
        for folder in LIFTED:
            lifted = super().translate_path('/' + folder + path)
            if os.path.exists(lifted):
                return lifted
        # the cv's old address, kept working online by the publish step
        if path.split('?')[0] == '/mary-wilson-resume.pdf':
            return os.path.join(ROOT, 'assets', 'mary-wilson-resume.pdf')
        return direct

    def send_error(self, code, message=None, explain=None):
        # show the site's own 404 page, like github pages does
        if code == 404:
            body = open(os.path.join(ROOT, '404.html'), 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)


print(f'previewing on http://localhost:{PORT}  (ctrl+c to stop)')
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
