from pydantic import BaseModel

class ServiceOrder(BaseModel):

    customer_id: str

    service_type: str

    bandwidth: str

    qos: str

    location_a: str

    location_b: str

    priority: str