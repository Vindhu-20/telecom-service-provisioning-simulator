from fastapi import APIRouter
from database import orders_collection
from models.order import ServiceOrder
from bson import ObjectId
from services.tmf641_service import generate_tmf641
from services.workflow_service import WORKFLOW_STAGES
from services.audit_service import create_audit_log
from fastapi import HTTPException
from database import inventory_collection
from database import workflow_collection
from services.provisioning_service import provision_order
from bson import ObjectId
from services.rbac_service import check_permission
from fastapi import Depends
from datetime import datetime
from database import failures_collection
from fastapi import HTTPException
from datetime import datetime
from bson import ObjectId
from services.auth_service import get_current_user
from logger import logger
from models.responses import OrderResponse
from models.responses import ExecuteResponse
from models.responses import FailureResponse

router = APIRouter()

@router.post(
    "/orders",
    response_model=OrderResponse,
    summary="Create Service Order",
    tags=["Orders"]
)
def create_order(
    order: ServiceOrder,
    current_user: dict = Depends(get_current_user)
):
    check_permission(
    current_user["role"],
    ["admin", "operator"]
)

    logger.info("Creating new service order")

    order_data = order.dict()

    # Normalize values
    order_data["service_type"] = order_data["service_type"].upper()
    order_data["priority"] = order_data["priority"].upper()

    order_data["status"] = "PENDING"

    result = orders_collection.insert_one(order_data)

    workflow_collection.insert_one({
    "order_id": str(result.inserted_id),
    "current_stage": "Order Received",
    "status": "IN_PROGRESS",
    "history": [
        {
            "stage": "Order Received",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]
})
    logger.info(f"Order {result.inserted_id} created successfully")

    # Audit Log
    create_audit_log(
    current_user["username"],
    "Create Service Order",
    "SUCCESS"
)

    return {
        "message": "Order Created",
        "order_id": str(result.inserted_id)
    }


@router.get("/orders")
def get_orders():

    orders = []

    for order in orders_collection.find():

        order["_id"] = str(order["_id"])

        orders.append(order)

    return orders

@router.get("/orders/{order_id}/tmf641")
def get_tmf641(order_id: str):

    order = orders_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        return {"error": "Order not found"}

    return generate_tmf641(order)

@router.get("/orders/{order_id}/workflow")
def get_workflow(order_id: str):

    workflow = workflow_collection.find_one(
        {"order_id": order_id}
    )

    if not workflow:
        return {
            "error": "Workflow Not Found"
        }

    workflow["_id"] = str(workflow["_id"])

    return workflow

@router.post(
    "/orders/{order_id}/simulate-failure",
    summary="Simulate Provisioning Failure",
    description="Simulates a provisioning failure for testing and records it in the failure reports.",
    tags=["Failures"]
)
def simulate_failure(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):

    check_permission(
        current_user["role"],
        ["admin"]
    )

    logger.warning(
        f"Failure simulation started for order {order_id}"
    )

    try:

        # Get current workflow stage
        workflow = workflow_collection.find_one(
            {"order_id": order_id}
        )

        if not workflow:
            raise HTTPException(
                status_code=404,
                detail="Workflow not found"
            )

        current_stage = workflow["current_stage"]

        failure_data = {

            "order_id": order_id,

            "failed_stage": current_stage,

            "failure_reason": "Resource Unavailable",

            "suggested_fix": "Increase Resource Capacity",

            "timestamp": datetime.utcnow().isoformat()

        }

        result = failures_collection.insert_one(
            failure_data
        )

        # Update Order
        orders_collection.update_one(

            {"_id": ObjectId(order_id)},

            {

                "$set": {

                    "status": "FAILED"

                }

            }

        )

        # Update Workflow
        workflow_collection.update_one(

            {"order_id": order_id},

            {

                "$set": {

                    "status": "FAILED",

                    "failed_stage": current_stage

                }

            }

        )

        create_audit_log(

            current_user["username"],

            "Provisioning Failure",

            "FAILED"

        )

        logger.warning(
            f"Failure recorded for order {order_id}"
        )

        return {

            "message": "Failure simulated successfully",

            "failure_id": str(result.inserted_id)

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )
@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    check_permission(
    current_user["role"],
    ["admin", "operator"]
)

    valid_statuses = [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "FAILED"
    ]

    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid Status"
        )

    result = orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "status": status
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Order Not Found"
        )
    
        # Auto-create inventory when completed
    if status == "COMPLETED":

        order = orders_collection.find_one(
            {"_id": ObjectId(order_id)}
        )

        inventory_collection.insert_one({
            "service_id": str(order["_id"]),
            "customer_id": order["customer_id"],
            "service_type": order["service_type"],
            "status": "ACTIVE"
        })

    create_audit_log(
    current_user["username"],
    f"Order Status Changed To {status}",
    "SUCCESS"
)

    return {
        "message": "Status Updated",
        "status": status
    }

@router.put("/orders/{order_id}/workflow")
def advance_workflow(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):

    check_permission(
        current_user["role"],
        ["admin", "operator"]
    )

    workflow = workflow_collection.find_one(
        {"order_id": order_id}
    )

    if not workflow:
        return {
            "error": "Workflow Not Found"
        }

    current_stage = workflow["current_stage"]

    current_index = WORKFLOW_STAGES.index(
        current_stage
    )

    if current_index < len(WORKFLOW_STAGES) - 1:

        next_stage = WORKFLOW_STAGES[
            current_index + 1
        ]

        # Update Order Status
        if next_stage == "Completed":
            order_status = "COMPLETED"
        else:
            order_status = "IN_PROGRESS"

        # Update Workflow
        workflow_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "current_stage": next_stage
                },
                "$push": {
                    "history": {
                        "stage": next_stage,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
            }
        )

        # Update Order Status
        orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "status": order_status
                }
            }
        )

        # Create Inventory Entry
        if next_stage == "Inventory Update":

            order = orders_collection.find_one(
                {"_id": ObjectId(order_id)}
            )

            existing = inventory_collection.find_one(
                {"service_id": order_id}
            )

            if not existing:

                inventory_collection.insert_one({

                    "service_id": order_id,

                    "customer_id": order["customer_id"],

                    "service_type": order["service_type"],

                    "status": "PROVISIONED"

                })

        # Activate Service
        if next_stage == "Service Activation":

            inventory_collection.update_one(

                {"service_id": order_id},

                {

                    "$set": {

                        "status": "ACTIVE"

                    }

                }

            )

        # Complete Workflow
        if next_stage == "Completed":

            workflow_collection.update_one(

                {"order_id": order_id},

                {

                    "$set": {

                        "status": "COMPLETED"

                    }

                }

            )

        logger.info(
            f"Workflow for Order {order_id} advanced to {next_stage}"
        )

        create_audit_log(
            current_user["username"],
            f"Workflow moved to {next_stage}",
            "SUCCESS"
        )

        return {
            "message": "Workflow Advanced",
            "current_stage": next_stage
        }

    return {
        "message": "Workflow Completed"
    }

@router.get("/orders/search")
def search_orders(
    status: str = None,
    service_type: str = None,
    customer_id: str = None
):

    query = {}

    if status:
        query["status"] = status

    if service_type:
        query["service_type"] = service_type

    if customer_id:
        query["customer_id"] = customer_id

    orders = []

    for order in orders_collection.find(query):

        order["_id"] = str(order["_id"])

        orders.append(order)

    return orders

from models.responses import ExecuteResponse

@router.post(
    "/orders/{order_id}/execute",
    response_model=ExecuteResponse,
    summary="Execute Provisioning",
    tags=["Provisioning"]
)
def execute_provisioning(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):

    check_permission(
        current_user["role"],
        ["admin", "operator"]
    )

    return provision_order(order_id)