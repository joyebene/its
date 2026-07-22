import { ShipmentStatus } from "@/models/Shipment";
import {
    CheckCircle2,
    Circle,
} from "lucide-react";

const steps = Object.values(ShipmentStatus);

interface Props {
    currentStatus: ShipmentStatus;
}

export default function ShipmentTimeline({
    currentStatus,
}: Props) {

    const currentIndex =
        steps.indexOf(currentStatus);

    return (

        <div className="rounded-xl border bg-white p-6">

            <h2 className="font-semibold mb-6">
                Shipment Timeline
            </h2>

            <div className="space-y-5">

                {steps.map((step, index) => {

                    const completed =
                        index <= currentIndex;

                    return (

                        <div
                            key={step}
                            className="flex items-center gap-4"
                        >

                            {completed ? (

                                <CheckCircle2
                                    className="text-green-600"
                                />

                            ) : (

                                <Circle
                                    className="text-gray-400"
                                />

                            )}

                            <p>

                                {step.replaceAll(
                                    "_",
                                    " "
                                )}

                            </p>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}