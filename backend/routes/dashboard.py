from fastapi import APIRouter
from database import (
    orders_collection,
    inventory_collection,
    customers_collection
)

router = APIRouter()


@router.get("/dashboard/stats")
def get_dashboard_stats():

    total_customers = customers_collection.count_documents({})

    total_orders = orders_collection.count_documents({})

    pending_orders = orders_collection.count_documents(
        {"status": "PENDING"}
    )

    completed_orders = orders_collection.count_documents(
        {"status": "COMPLETED"}
    )

    failed_orders = orders_collection.count_documents(
        {"status": "FAILED"}
    )

    in_progress_orders = orders_collection.count_documents(
        {"status": "IN_PROGRESS"}
    )

    active_services = inventory_collection.count_documents(
        {"status": "ACTIVE"}
    )

    # Success Rate
    success_rate = 0

    if total_orders > 0:
        success_rate = round(
            (completed_orders / total_orders) * 100,
            2
        )

    # ----------------------------
    # Top Service Types
    # ----------------------------

    pipeline = [
        {
            "$group": {
                "_id": "$service_type",
                "count": {
                    "$sum": 1
                }
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]

    top_services = []

    for item in orders_collection.aggregate(pipeline):

        top_services.append({

            "service_type": item["_id"],

            "count": item["count"]

        })

    # ----------------------------
    # Priority Distribution
    # ----------------------------

    priority_pipeline = [

        {
            "$group": {

                "_id": "$priority",

                "count": {

                    "$sum": 1
                }
            }
        }
    ]

    priorities = {}

    for item in orders_collection.aggregate(
        priority_pipeline
    ):

        priorities[item["_id"]] = item["count"]

    return {

        "customers": {

            "total": total_customers

        },

        "orders": {

            "total": total_orders,

            "pending": pending_orders,

            "completed": completed_orders,

            "failed": failed_orders,

            "in_progress": in_progress_orders

        },

        "active_services": active_services,

        "success_rate": success_rate,

        "top_service_types": top_services,

        "priority_distribution": priorities

    }