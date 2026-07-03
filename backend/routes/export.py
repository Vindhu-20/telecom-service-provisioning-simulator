from fastapi import APIRouter
from fastapi.responses import FileResponse

import pandas as pd
import os

from database import (
    orders_collection,
    failures_collection,
    customers_collection
)

router = APIRouter()

@router.get("/reports/export/orders")
def export_orders():

    orders = list(orders_collection.find())

    for order in orders:
        order["_id"] = str(order["_id"])

    df = pd.DataFrame(orders)

    os.makedirs("exports", exist_ok=True)

    file_path = "exports/orders.csv"

    df.to_csv(file_path, index=False)

    return FileResponse(
        file_path,
        media_type="text/csv",
        filename="orders.csv"
    )

@router.get("/reports/export/failures")
def export_failures():

    failures = list(failures_collection.find())

    for failure in failures:
        failure["_id"] = str(failure["_id"])

    df = pd.DataFrame(failures)

    os.makedirs("exports", exist_ok=True)

    file_path = "exports/failures.csv"

    df.to_csv(file_path, index=False)

    return FileResponse(
        file_path,
        media_type="text/csv",
        filename="failures.csv"
    )

@router.get("/reports/export/customers")
def export_customers():

    customers = list(customers_collection.find())

    for customer in customers:
        customer["_id"] = str(customer["_id"])

    df = pd.DataFrame(customers)

    os.makedirs("exports", exist_ok=True)

    file_path = "exports/customers.csv"

    df.to_csv(file_path, index=False)

    return FileResponse(
        file_path,
        media_type="text/csv",
        filename="customers.csv"
    )
