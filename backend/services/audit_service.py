from datetime import datetime
from database import audit_collection

def create_audit_log(user, action, status):

    audit_collection.insert_one({
        "user": user,
        "action": action,
        "status": status,
        "timestamp": datetime.now().isoformat()
    })