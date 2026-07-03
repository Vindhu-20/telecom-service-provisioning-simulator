from fastapi import APIRouter
from database import customers_collection
from models.customer import Customer

router = APIRouter()

@router.post("/customers")
def create_customer(customer: Customer):

    customer_data = customer.dict()

    result = customers_collection.insert_one(customer_data)

    return {
        "message": "Customer Created",
        "id": str(result.inserted_id)
    }

@router.get("/customers")
def get_customers():

    customers = []

    for customer in customers_collection.find():

        customer["_id"] = str(customer["_id"])

        customers.append(customer)

    return customers