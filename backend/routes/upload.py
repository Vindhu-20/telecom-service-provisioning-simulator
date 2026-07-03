from fastapi import APIRouter, UploadFile, File
from database import (
    orders_collection,
    workflow_collection
)
from services.audit_service import create_audit_log
import pandas as pd
import os

router = APIRouter()

@router.post("/orders/upload")
async def upload_orders(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    df = pd.read_csv(file_path)

    success = 0
    failed = 0
    errors = []

    for index, row in df.iterrows():

        try:

            order = {
                "customer_id": row["customer_id"],
                "service_type": row["service_type"],
                "bandwidth": row["bandwidth"],
                "qos": row["qos"],
                "location_a": row["location_a"],
                "location_b": row["location_b"],
                "priority": row["priority"],
                "status": "PENDING"
            }

            result = orders_collection.insert_one(order)

            workflow_collection.insert_one({
                "order_id": str(result.inserted_id),
                "current_stage": "Order Received",
                "status": "IN_PROGRESS",
                "history": []
            })

            create_audit_log(
                "admin",
                "Bulk Order Upload",
                "SUCCESS"
            )

            success += 1

        except Exception as e:

            failed += 1

            errors.append({
                "row": index + 2,
                "error": str(e)
            })

    return {

        "total_rows": len(df),

        "successful_imports": success,

        "failed_imports": failed,

        "errors": errors

    }