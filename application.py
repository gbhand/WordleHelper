# import all the necessary libraries
import json
import os
from urllib.request import Request
from webbrowser import get
from wsgiref.simple_server import make_server

from pyramid.config import Configurator
from pyramid.response import FileResponse

from wordle import get_possible_words


def get_answers(req: Request) -> dict:
    letters = json.loads(req.text)["letters"]
    return {"answers": get_possible_words(letters)}


def index_page(req: Request) -> FileResponse:
    return FileResponse("index.html")


# Main entrypoint

# with Configurator() as config:
config = Configurator()
# Create a route called home
config.add_route("home", "/")
# Bind the view (defined by index_page) to the route named ‘home’
config.add_view(index_page, route_name="home")

# Create a route that handles server HTTP requests at: /photos/photo_id
config.add_route("answers", "/answers")
# Binds the function get_photo to the photos route and returns JSON
# Note: This is a REST route because we are returning a RESOURCE!
config.add_view(get_answers, route_name="answers", renderer="json")

# Add a static view
# This command maps the folder “./public” to the URL “/”
config.add_static_view(name="/", path="./public", cache_max_age=3600)

# Create an app with the configuration specified above
application = config.make_wsgi_app()
# ip = "0.0.0.0"
# port = 8000
# print(f"Serving at http://{'localhost' if ip == '0.0.0.0' else ip}:{port}")
if __name__ == "__main__":
    # Start the application on port 8000
    server = make_server('', 8000, application)
    server.serve_forever()
