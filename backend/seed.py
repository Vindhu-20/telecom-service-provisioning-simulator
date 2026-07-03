from database import users_collection

users = [

    {
        "username":"admin",
        "password":"admin123",
        "role":"admin"
    },

    {
        "username":"operator",
        "password":"operator123",
        "role":"operator"
    },

    {
        "username":"viewer",
        "password":"viewer123",
        "role":"viewer"
    }
]

for user in users:

    existing = users_collection.find_one(
        {"username": user["username"]}
    )

    if not existing:
        users_collection.insert_one(user)

print("Users Seeded Successfully")