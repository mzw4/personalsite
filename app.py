import os, json
from flask import Flask, request, redirect, render_template, url_for, jsonify, send_from_directory, session, make_response
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from threading import Thread
from bson import Binary, Code
from bson.json_util import dumps
from bson.objectid import ObjectId
import requests

app = Flask(__name__)

PROJECTS_DIR = 'projects/'
SECTIONS_DIR = 'sections/'

_project_data = [
  {
    'id': 'selfiebot',
    'name': 'Selfiebot'
  }, {
    'id': 'filmrater',
    'name': 'Film Rating Predictor'
  }, {
    'id': 'okra',
    'name': 'Okra App'
  }, {
    'id': 'pathogenesis',
    'name': 'Pathogenesis Game'
  }, {
    'id': 'ai_prac',
    'name': 'Optimization of Asset Placement'
  }
]

@app.route("/")
def index():
  return render_template('main.html', content_root=url_for('static', filename='content/'))

@app.route("/ajax_get_project_templates", methods=['GET'])
def ajax_get_project_templates():
  for project in _project_data:
    project['template'] = render_template(PROJECTS_DIR + project['id'] + '.html')
  return jsonify({ 'data': _project_data })

@app.route('/ajax_get_section_templates', methods=['GET'])
def get_section_templates():
  sections = json.loads(request.args.get('sections', []))

  templates = {}
  for section in sections:
    templates[section] = render_template(SECTIONS_DIR + section + '.html')

  return jsonify(templates)

if __name__ == "__main__":
  app.run(debug=True, port=8080)

