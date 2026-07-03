from fastapi import APIRouter, Depends

from database import customers_collection
from models.customer import Customer

from services.auth_service import get_current_user
from services.rbac_service import check_permission

router = APIRouter()


@router.post("/customers")
def create_customer(
    customer: Customer,
    current_user: dict = Depends(get_current_user)
):

    # Only Admin & Operator can create customers
    check_permission(
        current_user["role"],
        ["admin", "operator"]
    )

    customer_data = customer.dict()

    result = customers_collection.insert_one(customer_data)

    return {
        "message": "Customer Created",
        "id": str(result.inserted_id)
    }


@router.get("/customers")
def get_customers(
    current_user: dict = Depends(get_current_user)
):

    # All logged-in users can view customers
    check_permission(
        current_user["role"],
        ["admin", "operator", "viewer"]
    )

    customers = []

    for customer in customers_collection.find():

        customer["_id"] = str(customer["_id"])

        customers.append(customer)

    return customers