from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URL)

db = client[os.getenv("DATABASE_NAME")]
# db = client["telecom_provisioning"]

customers_collection = db["customers"]
orders_collection = db["orders"]
inventory_collection = db["inventory"]
users_collection = db["users"]
audit_collection = db["audit_logs"]
workflow_collection = db["workflow"]
failures_collection = db["failures"]