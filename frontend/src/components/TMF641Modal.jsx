import { useState } from "react";

export default function TMF641Modal({

    data,

    onClose

}) {

    const [showJson, setShowJson] = useState(false);

    if (!data) return null;

    const service = data.serviceOrderItem[0].service;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-4/5 max-w-5xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6">

                    <h1 className="text-2xl font-bold">

                        TMF641 Service Order

                    </h1>

                    <button

                        onClick={onClose}

                        className="text-red-600 text-2xl"

                    >

                        ✕

                    </button>

                </div>

                <div className="p-8 space-y-8">

                    {/* Summary */}

                    <div className="grid grid-cols-2 gap-6">

                        <InfoCard

                            title="Order ID"

                            value={data.id}

                        />

                        <InfoCard

                            title="Status"

                            value={data.state.toUpperCase()}

                        />

                        <InfoCard

                            title="Customer"

                            value={service.customerId}

                        />

                        <InfoCard

                            title="Service"

                            value={service.serviceType}

                        />

                        <InfoCard

                            title="Priority"

                            value={service.priority}

                        />

                    </div>

                    {/* Service Parameters */}

                    <div>

                        <h2 className="text-xl font-bold mb-4">

                            Service Parameters

                        </h2>

                        <div className="grid grid-cols-2 gap-6">

                            <InfoCard

                                title="Bandwidth"

                                value={service.bandwidth}

                            />

                            <InfoCard

                                title="QoS"

                                value={service.qos}

                            />

                        </div>

                    </div>

                    {/* Locations */}

                    <div>

                        <h2 className="text-xl font-bold mb-5">

                            Service Path

                        </h2>

                        <div className="flex items-center justify-center gap-8">

                            <LocationCard

                                city={service.locationA}

                                label="Primary Site"

                            />

                            <div className="text-4xl">

                                →

                            </div>

                            <LocationCard

                                city={service.locationB}

                                label="Remote Site"

                            />

                        </div>

                    </div>

                    {/* JSON */}

                    <div>

                        <button

                            onClick={() =>

                                setShowJson(!showJson)

                            }

                            className="font-bold text-blue-600"

                        >

                            {showJson

                                ? "Hide Raw TMF641 JSON"

                                : "Show Raw TMF641 JSON"}

                        </button>

                        {

                            showJson &&

                            <pre className="bg-gray-900 text-green-300 rounded-lg p-5 mt-4 overflow-auto">

                                {JSON.stringify(

                                    data,

                                    null,

                                    4

                                )}

                            </pre>

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

function InfoCard({

    title,

    value

}) {

    return (

        <div className="border rounded-lg p-4">

            <p className="text-gray-500">

                {title}

            </p>

            <h2 className="text-xl font-bold mt-2">

                {value}

            </h2>

        </div>

    );

}

function LocationCard({

    city,

    label

}) {

    return (

        <div className="border rounded-lg p-6 text-center w-60">

            <div className="text-4xl">

                📍

            </div>

            <h2 className="font-bold text-xl mt-3">

                {city}

            </h2>

            <p className="text-gray-500">

                {label}

            </p>

        </div>

    );

}