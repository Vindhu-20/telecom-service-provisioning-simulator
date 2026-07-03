import { X } from "lucide-react";

const stages = [
    "Order Received",
    "Validation",
    "Resource Check",
    "Service Design",
    "Provisioning",
    "Inventory Update",
    "Service Activation",
    "Completed"
];

export default function WorkflowModal({
    workflow,
    onClose
}) {

    if (!workflow) return null;

    const currentIndex = stages.indexOf(
        workflow.current_stage
    );

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Workflow
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>

                {stages.map((stage, index) => (

                    <div
                        key={stage}
                        className="flex items-center mb-4"
                    >

                        <div
                            className={`w-5 h-5 rounded-full mr-4 ${
                                workflow.status === "FAILED" &&
                                workflow.failed_stage === stage
                                    ? "bg-red-500"
                                    : index <= currentIndex
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                        />

                        <span
                            className={
                                workflow.status === "FAILED" &&
                                workflow.failed_stage === stage
                                    ? "text-red-600 font-semibold"
                                    : ""
                            }
                        >
                            {stage}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}