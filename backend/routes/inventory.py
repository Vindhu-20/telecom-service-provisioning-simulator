from fastapi import APIRouter
from database import inventory_collection
from models.inventory import Inventory
from logger import logger
router = APIRouter()

@router.post("/inventory")
def create_inventory(service: Inventory):

    service_data = service.dict()

    result = inventory_collection.insert_one(
        service_data
    )
    
    return {
        "message": "Inventory Created",
        "id": str(result.inserted_id)
    }


@router.get("/inventory")
def get_inventory():

    inventory = []

    for item in inventory_collection.find():

        item["_id"] = str(item["_id"])

        inventory.append(item)

    return inventory