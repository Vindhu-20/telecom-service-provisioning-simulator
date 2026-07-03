from fastapi import APIRouter
from database import orders_collection

router = APIRouter()


@router.get("/reports/provisioning")
def provisioning_report():

    total_orders = orders_collection.count_documents({})

    completed = orders_collection.count_documents(
        {"status": "COMPLETED"}
    )

    failed = orders_collection.count_documents(
        {"status": "FAILED"}
    )

    pending = orders_collection.count_documents(
        {"status": "PENDING"}
    )

    success_rate = 0

    if total_orders > 0:

        success_rate = round(
            (completed / total_orders) * 100,
            2
        )

    return {
        "total_orders": total_orders,
        "completed": completed,
        "failed": failed,
        "pending": pending,
        "success_rate": success_rate
    }