from pydantic import BaseModel

class Customer(BaseModel):
    name: str
    company_name: str
    email: str
    phone: str