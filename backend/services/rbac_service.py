from fastapi import HTTPException

def check_permission(user_role, allowed_roles):

    if user_role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permission Denied"
        )