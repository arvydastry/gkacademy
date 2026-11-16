#!/usr/bin/env python3
"""GK Academy demo: vietinis peržiūros serveris.

Naudojimas:  python3 serve.py [prievadas]     (numatytasis 8191)  ->  http://localhost:8191

Kuo skiriasi nuo „python3 -m http.server“: didesnė užklausų eilė (naršyklė iškart prašo keliasdešimt failų),
išjungtas kaupimas talpykloje (matomi naujausi pakeitimai) ir „Range“ užklausos, kurių reikia „Safari“ vaizdo įrašams.
"""
import functools
import http.server
import os
import re
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8191
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):  # tylus
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        m = re.match(r"bytes=(\d*)-(\d*)$", rng or "")
        if not m or not os.path.isfile(path):
            return super().send_head()
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2) or 0))
        end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None
        f = open(path, "rb")
        f.seek(start)
        self._left = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(self._left))
        self.end_headers()
        return f

    def copyfile(self, source, outputfile):
        left = getattr(self, "_left", None)
        if left is None:
            return super().copyfile(source, outputfile)
        self._left = None
        while left > 0:
            chunk = source.read(min(65536, left))
            if not chunk:
                break
            outputfile.write(chunk)
            left -= len(chunk)


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


if __name__ == "__main__":
    with Server(("127.0.0.1", PORT), functools.partial(Handler, directory=ROOT)) as httpd:
        print("GK Academy demo: http://localhost:%d" % PORT)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
