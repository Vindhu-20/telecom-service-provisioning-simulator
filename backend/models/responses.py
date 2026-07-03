from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class OrderResponse(BaseModel):
    message: str
    order_id: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


class ExecuteResponse(BaseModel):
    success: bool
    message: str

class FailureResponse(BaseModel):
    success: bool
    message: str