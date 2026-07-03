from fastapi import FastAPI

from routes.customer import router as customer_router
from routes.orders import router as order_router
from routes.dashboard import router as dashboard_router
from routes.inventory import router as inventory_router
from routes.auth import router as auth_router
from routes.audit import router as audit_router
from routes.reports import router as reports_router
from routes.topology import router as topology_router
from routes.failures import router as failures_router
from routes.export import router as export_router
from routes.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS").split(",")

app = FastAPI(
    title="Telecom Service Provisioning Simulator",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip() for origin in CORS_ORIGINS
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)
app.include_router(inventory_router)
app.include_router(auth_router)
app.include_router(audit_router)
app.include_router(reports_router)
app.include_router(topology_router)
app.include_router(failures_router)
app.include_router(export_router)
app.include_router(upload_router)

@app.get("/")
def home():
    return {
        "message": "Telecom Provisioning Simulator Running"
    }

@app.get("/health")
def health():
    return {
        "status": "UP"
    }