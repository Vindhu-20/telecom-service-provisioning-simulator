from fastapi import APIRouter, HTTPException
from database import users_collection
from services.security_service import create_access_token
from fastapi import Header
from services.auth_service import verify_token
from fastapi import Depends
from services.auth_service import (
    verify_token,
    oauth2_scheme
)
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from logger import logger
from models.responses import LoginResponse

router = APIRouter()

@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Login",
    tags=["Authentication"]
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    user = users_collection.find_one(
        {
            "username": form_data.username
        }
    )
    
    if not user:

        logger.warning(
        f"Invalid login attempt for {form_data.username}"
    )

        raise HTTPException(
            status_code=401,
            detail="Invalid Username"
        )
        
    if user["password"] != form_data.password:

        logger.warning(
        f"Invalid password for {form_data.username}"
    )

        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )
    
    token = create_access_token(
        {
            "username": user["username"],
            "role": user["role"]
        }
    )
    
    return {
    "access_token": token,
    "token_type": "bearer",
    "role": user["role"]
}
from fastapi import Depends
from services.auth_service import get_current_user

@router.get("/me")
def me(
    current_user: dict = Depends(get_current_user)
):

    return current_user
