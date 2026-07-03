from fastapi import APIRouter
from bson import ObjectId

from database import orders_collection

router = APIRouter()


@router.get("/topology/{order_id}")
def get_topology(order_id: str):

    order = orders_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        return {
            "error": "Order Not Found"
        }

    return {
    "customer_id": order["customer_id"],
    "service_type": order["service_type"],
    "status": order["status"],

    "sites": [
        {
            "name": order["location_a"],
            "role": "Primary Site"
        },
        {
            "name": order["location_b"],
            "role": "Remote Site"
        }
    ],

    "links": [
        {
            "source": order["location_a"],
            "target": order["location_b"],
            "service": order["service_type"],
            "bandwidth": order["bandwidth"],
            "qos": order["qos"]
        }
    ]
}