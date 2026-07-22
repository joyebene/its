import { Plus } from "lucide-react";

import Button from "@/components/shared/Button";

export default function DashboardHeader() {
    return (
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

                <h1 className="text-3xl font-bold text-slate-900">
                    How is it going?
                </h1>

                <p className="mt-2 text-slate-500">
                    Monitor all shipments, customs clearance and deliveries.
                </p>

            </div>

        <div className="w-fit">
               <Button className="w-fit px-6 flex items-center gap-2">
                <Plus className="mr-2 h-5 w-5" />

                Create Shipment
            </Button> 
        </div>
        

        </div>
    );
}