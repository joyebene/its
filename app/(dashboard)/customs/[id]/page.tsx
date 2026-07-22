import Card from "@/components/shared/Card";
import PageHeader from "@/components/shared/PageHeader";

import CustomsStatusBadge from "@/components/customs/CustomsStatusBadge";


export default function CustomsDetailsPage() {

    return (

        <div className="space-y-6">


            <PageHeader

                title="Customs Details"

                description="Customs clearance information."

            />



            <Card title="Customs Information">


                <div className="grid gap-6 md:grid-cols-2">


                    <Info

                        label="Shipment"

                        value="SHP-1001"

                    />



                    <Info

                        label="Container"

                        value="MSKU1234567"

                    />



                    <Info

                        label="Duty Amount"

                        value="₦250,000"

                    />



                    <div>

                        <p className="text-sm text-slate-500">
                            Status
                        </p>


                        <CustomsStatusBadge

                            status="DUTY_PENDING"

                        />


                    </div>



                    <Info

                        label="Processed By"

                        value="Admin"

                    />



                    <Info

                        label="Created Date"

                        value="22 July 2026"

                    />



                </div>


            </Card>




            <Card title="Remarks">


                <p className="text-slate-600">

                    Awaiting customs duty payment.

                </p>


            </Card>



        </div>

    );
}



function Info({

    label,

    value,

}: {

    label: string;

    value: string;

}) {

    return (

        <div>

            <p className="text-sm text-slate-500">

                {label}

            </p>


            <p className="font-semibold">

                {value}

            </p>


        </div>

    );

}