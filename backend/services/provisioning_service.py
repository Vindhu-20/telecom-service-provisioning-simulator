from bson import ObjectId

from database import (
    orders_collection,
    workflow_collection,
    inventory_collection
)

from services.audit_service import create_audit_log
from services.workflow_service import WORKFLOW_STAGES
from datetime import datetime
from logger import logger

def provision_order(order_id: str):

    logger.info(f"Provisioning started for order {order_id}")
    # Fetch Order
    order = orders_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        logger.error(f"Order {order_id} not found")
        return {
            "success": False,
            "message": "Order Not Found"
        }

    # Validation
    service_type = order["service_type"].upper()

    valid_services = [
    "VPRN",
    "EPIPE",
    "MPLS",
    "EVPN",
    "VPLS",
    "INTERNET"
]
    if service_type not in valid_services:
        logger.error(
    f"Unsupported service type: {order['service_type']}"
)
        create_audit_log(
            "admin",
            "Provision Service",
            "FAILED"
        )

        return {
            "success": False,
            "message": "Unsupported Service Type"
        }

    # Update Workflow
    import time

    for stage in WORKFLOW_STAGES:

        workflow_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "current_stage": stage,
                    "status": "IN_PROGRESS"
                },
                "$push": {
                    "history": {
                        "stage": stage,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
            }
        )

        create_audit_log(
            "system",
            f"{stage} Completed",
            "SUCCESS"
        )

        time.sleep(1)
    
    workflow_collection.update_one(
        {"order_id": order_id},
        {
            "$set": {
                "current_stage": stage,
                "status": (
                    "COMPLETED"
                    if stage == "Completed"
                    else "IN_PROGRESS"
                )
            }
        }
)

    # Update Order Status
    orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "status": "COMPLETED"
            }
        }
    )
    
    logger.info(
    f"Provisioning completed for order {order_id}"
)

    # Create Inventory Entry (only if it doesn't already exist)

    existing_inventory = inventory_collection.find_one(
        {
            "service_id": order_id
        }
    )

    if not existing_inventory:

        inventory_collection.insert_one(
            {
                "service_id": order_id,
                "customer_id": order["customer_id"],
                "service_type": order["service_type"],
                "status": "ACTIVE"
            }
        )

        logger.info(
            f"Inventory created for service {order_id}"
        )

    else:

        inventory_collection.update_one(

            {
                "service_id": order_id
            },

            {

                "$set": {

                    "status": "ACTIVE"

                }

            }

        )

        logger.info(
            f"Inventory already exists for {order_id}, status updated."
        )
    
    # Audit Log
    create_audit_log(
        "admin",
        "Provision Service",
        "SUCCESS"
    )

    return {
        "success": True,
        "message": "Provisioning Completed"
    }