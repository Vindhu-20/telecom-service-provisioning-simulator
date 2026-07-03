def generate_tmf641(order):

    status_map = {

        "PENDING": "acknowledged",

        "IN_PROGRESS": "inProgress",

        "COMPLETED": "completed",

        "FAILED": "failed"

    }

    return {

        "id": str(order["_id"]),

        "state": status_map.get(
            order["status"],
            "acknowledged"
        ),

        "serviceOrderItem": [

            {

                "action": "add",

                "service": {

                    "customerId": order["customer_id"],

                    "serviceType": order["service_type"],

                    "bandwidth": order["bandwidth"],

                    "qos": order["qos"],

                    "locationA": order["location_a"],

                    "locationB": order["location_b"],

                    "priority": order["priority"]

                }

            }

        ]

    }