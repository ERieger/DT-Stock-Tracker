# A script to add materials to the database
from pymongo import MongoClient
import pprint
import mongo_uri

client = MongoClient(mongo_uri.uri)

db = client['dt-stock-tracker']

materials_list = db.materials

material_types = [
  'sheet',
  'plank',
  'dowel'
]

while (True):
  type = int(input("Please choose a material type: "))
  name = str(input("Please list the material name: "))
  code = str(input("Please list the material code: ")).upper()
  price = float(input("Please list the material price: "))
  material = {}

  material['type'] = type
  material['id'] = code
  material['name'] = name
  material['dim'] = {}

  if ((type==1) or (type==2)):
    width = float(input("Please list the material width: "))
    length = float(input("Please list the material length: "))
    thickness = float(input("Please list the material thickness: "))

    if(width): material['dim']['w'] = width
    if(length): material['dim']['l'] = length
    if(thickness): material['dim']['t'] = thickness

  elif (type==3):
    radius = float(input("Please list the material radius: "))
    length = float(input("Please list the material length: "))

    if(radius): material['dim']['r'] = radius
    if(length): material['dim']['l'] = length

  
  pprint.pprint(material)

  materials_list.insert_one(material)