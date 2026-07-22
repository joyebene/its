"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";


interface CustomsForm {

    shipment: string;

    dutyAmount: string;

    status:
    | "PENDING"
    | "UNDER_INSPECTION"
    | "DUTY_PENDING"
    | "DUTY_PAID"
    | "CLEARED";

    remarks: string;

}


export default function EditCustomsPage() {


    const router = useRouter();



    const [formData, setFormData] = useState<CustomsForm>({

        shipment: "SHP-1001",

        dutyAmount: "250000",

        status: "DUTY_PENDING",

        remarks: "Awaiting customs duty payment",

    });



    const [loading, setLoading] = useState(false);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {

        setFormData((prev) => ({

            ...prev,

            [e.target.name]: e.target.value,

        }));

    };




    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        setLoading(true);



        // TODO:
        // await fetch(`/api/customs/${id}`, {
        // method:"PUT",
        // body:JSON.stringify(formData)
        // })



        setTimeout(() => {

            setLoading(false);

            router.push("/customs");


        }, 1000);


    };




    return (

        <div className="space-y-6">


            <PageHeader

                title="Edit Customs Record"

                description="Update customs clearance information."

            />



            <Card title="Customs Details">


                <form

                    onSubmit={handleSubmit}

                    className="grid gap-5 md:grid-cols-2"

                >



                    <Input

                        label="Shipment"

                        name="shipment"

                        value={formData.shipment}

                        onChange={handleChange}

                    />




                    <Input

                        label="Duty Amount"

                        name="dutyAmount"

                        type="number"

                        value={formData.dutyAmount}

                        onChange={handleChange}

                    />





                    <div>


                        <label className="mb-2 block text-sm font-medium">

                            Status

                        </label>



                        <select

                            name="status"

                            value={formData.status}

                            onChange={handleChange}

                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"

                        >

                            <option value="PENDING">
                                Pending
                            </option>


                            <option value="UNDER_INSPECTION">
                                Under Inspection
                            </option>


                            <option value="DUTY_PENDING">
                                Duty Pending
                            </option>


                            <option value="DUTY_PAID">
                                Duty Paid
                            </option>


                            <option value="CLEARED">
                                Cleared
                            </option>


                        </select>


                    </div>





                    <div className="md:col-span-2">


                        <label className="mb-2 block text-sm font-medium">

                            Remarks

                        </label>


                        <textarea

                            name="remarks"

                            value={formData.remarks}

                            onChange={handleChange}

                            rows={4}

                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"

                        />


                    </div>





                    <div className="flex justify-end gap-3 md:col-span-2">


                        <Button

                            type="button"

                            variant="secondary"

                            onClick={() => router.back()}

                        >

                            Cancel

                        </Button>




                        <Button

                            type="submit"

                            loading={loading}

                        >

                            Update Customs

                        </Button>


                    </div>



                </form>


            </Card>



        </div>

    );

}