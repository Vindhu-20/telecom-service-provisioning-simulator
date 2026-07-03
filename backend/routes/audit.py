from fastapi import APIRouter
from database import audit_collection

router = APIRouter()

@router.get("/audit-logs")
def get_audit_logs():

    logs = []

    for log in audit_collection.find():

        log["_id"] = str(log["_id"])

        logs.append(log)

    return logs