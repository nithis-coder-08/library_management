from flask import Flask
from flask_pymongo import PyMongo,ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
try:
    app.config["MONGO_URI"] = "mongodb+srv://nithisthirumalai:MmKUlJgasoz1frPP@cluster0.m0jlvgi.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0"
    # app.config["MONGO_URI"] =  "mongodb+srv://harishij101:nFuIx52WonhbVNHy@cluster0.e59kdcr.mongodb.net/DB?retryWrites=true&w=majority&appName=Cluster0"
except:
    print('err')
mongodb_client = PyMongo(app)
db = mongodb_client.db
print(mongodb_client)
print(db)
from application import routes

#from pack import *