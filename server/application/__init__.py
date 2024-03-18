from flask import Flask
from flask_pymongo import PyMongo,ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
try:
    app.config["MONGO_URI"] = "mongodb+srv://nithisthirumalai:MmKUlJgasoz1frPP@cluster0.m0jlvgi.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0"
   
except:
    print('error occured')
mongodb_client = PyMongo(app)
db = mongodb_client.db
print(mongodb_client)
print(db)
from application import routes

#from pack import *
