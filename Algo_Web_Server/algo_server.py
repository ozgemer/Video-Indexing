import http.server
import socketserver
import threading
import queue
from functions import index_video
import json
import requests
import os

PORT = 8080

WEB_SERVER_PORT = 5050
# WEB_SERVER_IP = os.getenv('NODE_IP') #'127.0.0.1' for running locally
WEB_SERVER_IP = '172.20.0.12' # for run without docker use 127.0.0.1
WEB_SERVER_FULL_URL = f"http://{WEB_SERVER_IP}:{WEB_SERVER_PORT}/uploadVideoAlgo"


class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data_dict = json.loads(post_data.decode('utf-8'))
        response_data = {'message': 'Received data successfully', 'data': data_dict}
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        queue.put(data_dict)


class RequestProcessor(threading.Thread):
    def __init__(self, queue, process_func, lock):
        super().__init__()
        self.queue = queue
        self.process_func = process_func
        self.lock = lock

    def run(self):
        while True:
            data = self.queue.get()
            # Process the request data with the provided function
            with self.lock:
                self.process_func(data)
            self.queue.task_done()


def start_server(port, process_func):
    global queue
    queue = queue.Queue()

    # Start the request processor thread
    lock = threading.Lock()
    processor = RequestProcessor(queue, process_func, lock)
    processor.daemon = True
    processor.start()

    # Start the HTTP server
    with socketserver.TCPServer(("", port), MyHandler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()


def send_results_to_web_server(data):
    url = data["link"]
    name = data["name"]
    topic = data["topic"]
    ytTitle = data["ytTitle"]
    inner_topics = data["inner_topics"]
    indexing, topic_list, title,inner_topics_list = index_video(url,inner_topics,topic)
    if ytTitle == True:
        name = title
    params = None
    if topic_list is None:
        params = {"url": url, "name": name, "indexing": indexing, "tags": list(set(indexing.values())),"inner_topics":inner_topics_list}
    else:
        params = {"url": url, "name": name, "indexing": indexing, "tags": list(set(indexing.values())),
                  "topics": topic_list,"inner_topics":inner_topics_list}
    print(params)
    headers = {'Content-type': 'application/json'}
    response = requests.post(WEB_SERVER_FULL_URL, data=json.dumps(params), headers=headers)
    print(f"response from Web Server: \n {str(response)}")


start_server(PORT, send_results_to_web_server)
