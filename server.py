from fcntl import F_SEAL_SEAL
from flask import Flask, make_response, render_template, request
from pymongo import MongoClient
import mongo_uri
import json
from orderparser import OrderParser
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

# Function to decode JWT data - accepts a JWT object
def decodeJWT(request):
    token = request.get_data()  #Decode the post request
    try:
      token = token.decode('utf-8').replace('credential=', '').strip() # Convert to UTF-8, strip whitespace
      
      token = jwt.decode(token, verify=False) # Decode the token

      return token

    except: # If there was an error (invalid token)
      return 'Account token was not valid'

#check if an account exists
@app.route('/auth/exists', methods=['POST'])
def exists():
  # If an id is being sent to the server
  if request.method == 'POST':
    token = decodeJWT(request)

    if token != 'Account token was not valid':
      exists = [_ for _ in USERS.find({"_id": token['sub']})] # Searching the database to see if the account exists

      if (len(exists) == 0):  # Does not exist
        try:
          new_account(token)
          return 'Successfully added user'
        
        except:
          return 'Could not add user'
      else:                   # Exists
        return 'user exists'
    else:
      return 'Account token was not valid'

# Getting all projects which need completion
def get_projects():
  projects = [_ for _ in PROJECTS.find({'complete': False})]

  order_list = []
  print(projects)

  for project in projects:
    for material in project['pieces']:
      print(material)
      print(material['material'])

# Get user role - this is a band aid solution
@app.route('/auth/role', methods=['POST'])
def role():
  return

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

#make a class entry in the order report
def make_class_entry(class_name):
  parser = OrderParser()

  projects = PROJECTS.find({'class': class_name}, {'complete': False})

  class_pieces = parser.extract_class_pieces(projects)

  total_price = 0

  class_entry = {}

  class_entry['materials'] = {}

  for piece in class_pieces:
    material = MATERIALS.find_one({"id": piece})
    material_entry = parser.calculate_material_costs(material, class_pieces[piece])
    total_price = total_price + material_entry['price']
    class_entry['materials'][piece] = material_entry
  
  class_entry['price'] = total_price

  return class_entry

#make the overall order report
def make_order_report(class_list):
  report = {}

  price = 0

  for classes in class_list:
    class_report = make_class_entry(classes)

    price = price + class_report['price']

    report[classes] = class_report
  
  report['price'] = price

  return report

# Launching the flask server
if __name__ == "__main__":
  app.run(debug=True, port=5500)