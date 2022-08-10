# A script to add materials to the database
from pymongo import MongoClient
import pprint
import mongo_uri

client = MongoClient(mongo_uri.uri) # connect to the database

db = client['dt-stock-tracker']

materials_list = db.materials # we only need to edit the materials collection

material_types = [  # Possible types of materials
  'sheet',
  'plank',
  'dowel'
]

# The main function
if __name__ == "__main__":
  while (True):
    # Getting material properties
    type = int(input("Please choose a material type: "))
    name = str(input("Please list the material name: "))
    code = str(input("Please list the material code: ")).upper()
    price = float(input("Please list the material price: "))
    
    material = {} # Object to hold material properties
    material['type'] = type
    material['id'] = code
    material['name'] = name
    material['price'] = price
    material['dim'] = {}

    if ((type==1) or (type==2)):  # Sheet or plank
      width = float(input("Please list the material width: "))
      length = float(input("Please list the material length: "))
      thickness = float(input("Please list the material thickness: "))

      # Only insert if a dimension was input by the user
      if(width): material['dim']['w'] = width
      if(length): material['dim']['l'] = length
      if(thickness): material['dim']['t'] = thickness

    elif (type==3): # Dowel
      radius = float(input("Please list the material radius: "))
      length = float(input("Please list the material length: "))

      if(radius): material['dim']['r'] = radius
      if(length): material['dim']['l'] = length

    
    pprint.pprint(material) # Print the material's object

    materials_list.insert_one(material) # Insert into the database