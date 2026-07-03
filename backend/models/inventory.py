from pydantic import BaseModel

class Inventory(BaseModel):

    service_id: str

    customer_id: str

    service_type: str

    status: str