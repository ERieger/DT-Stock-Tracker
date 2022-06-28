from fcntl import F_SEAL_SEAL
from flask import Flask, render_template, request
from pymongo import MongoClient
import mongo_uri
import pprint
import json
from google.auth import jwt

client = MongoClient(mongo_uri.uri)

db = client['dt-stock-tracker']

print(db.list_collection_names())

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/summary')
def summary():
  return render_template('summary.html')

#check if an account exists
@app.route('/auth/exists', methods=['POST', 'GET'])
def exists():
  if request.method == 'POST':
    token = request.get_data()

    token = token.decode('utf-8').replace('credential=', '')
    
    token = jwt.decode(token, verify=False)

    exists = [_ for _ in db.users.find({"jti": token['jti']})]

    if (len(exists) == 0):
      return 'user does not exist'
    else:
      return 'user exists'

@app.route('/login')
def login():
  return render_template('login.html')

if __name__ == "__main__":
  app.run(debug=True, port=5500)