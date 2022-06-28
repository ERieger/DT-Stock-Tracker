from fcntl import F_SEAL_SEAL
from flask import Flask, make_response, render_template, request
from pymongo import MongoClient
import mongo_uri
import json
from google.auth import jwt

client = MongoClient(mongo_uri.uri)

db = client['dt-stock-tracker']

#The different database collections
MATERIALS = db.materials
USERS = db.users
PROJECTS = db.projects

app = Flask(__name__)

# The main dashboard page
@app.route('/')
def index():
  return render_template('index.html')

# The project entry form
@app.route('/form')
def form():
  return render_template('form.html')

# Order summary page
@app.route('/summary')
def summary():
  return render_template('summary.html')

#check if an account exists
@app.route('/auth/exists', methods=['POST'])
def exists():
  # If an id is being sent to the server
  if request.method == 'POST':
    token = request.get_data()  #Decode the post request

    try:
      token = token.decode('utf-8').replace('credential=', '').strip() # Convert to UTF-8, strip whitespace
      
      token = jwt.decode(token, verify=False) # Decode the token

      exists = [_ for _ in USERS.find({"_id": token['sub']})] # Searching the database to see if the account exists

      if (len(exists) == 0):  # Does not exist
        return 'user does not exist'
      else:                   # Exists
        return 'user exists'

    except: # If there was an error (invalid token)
      return 'Account token was not valid'

#Information about a particular material
@app.route('/material/info', methods=['POST'])
def material_info():
  # TBC
  return 'hello, world'

#A list of the available materials in the database
@app.route('/material/list')
def material_list():
  materials = [_['name'] for _ in MATERIALS.find()] # Query the database

  response = make_response(json.dumps(materials))   # Format the list of materials
  response.content_type = 'application/json'        # Set response type
  return response                                   # Send to the client

@app.route('/login')
def login():
  return render_template('login.html')

#create a new account given the google account credentials
def new_account(credential):
  # New user template json
  new_user = {
    "_id": credential['sub'],
    "name": credential['name'],
    "email": credential['email'],
    "admin": False,
    "projects": []
  }

  # Insert the user into the database
  USERS.insert_one(new_user)

# Launching the flask server
if __name__ == "__main__":
  app.run(debug=True, port=5500)