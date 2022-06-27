from flask import Flask, render_template
from pymongo import MongoClient
import mongo_uri

client = MongoClient(mongo_uri.uri)

db = client['dt-stock-tracker']


print(db.list_collection_names())

print(db.projects)

""" 
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/summary')
def summary():
  return render_template('summary.html')

if __name__ == "__main__":
  app.run(debug=True) """