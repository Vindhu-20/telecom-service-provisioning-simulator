from fastapi import APIRouter

from database import failures_collection

router = APIRouter()


@router.get("/reports/failures")
def get_failure_report():

    failures = []

    for failure in failures_collection.find():

        failure["_id"] = str(
            failure["_id"]
        )

        failures.append(failure)

    total_failures = len(failures)

    reasons = {}

    for failure in failures:

        reason = failure[
            "failure_reason"
        ]

        reasons[reason] = (
            reasons.get(reason, 0) + 1
        )

    return {

        "total_failures":
        total_failures,

        "failure_reasons":
        reasons,

        "failure_details":
        failures
    }