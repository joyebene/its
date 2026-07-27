"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";


interface Shipment {
  _id: string;
  shipmentNumber: string;
  trackingNumber: string;
}


export default function CreateCustomsPage() {

  const router = useRouter();


  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({

    shipment: "",

    dutyAmount: "",

    status: "PENDING",

    remarks: "",

  });



  useEffect(() => {

    fetchShipments();

  }, []);



  async function fetchShipments() {

    const token =
      localStorage.getItem("accessToken");


    const res = await fetch(
      "/api/shipments",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    const result = await res.json();


    if(res.ok){

      setShipments(result.data);

    }

  }




  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ){

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  }




  async function handleSubmit(
    e: React.FormEvent
  ){

    e.preventDefault();


    setLoading(true);


    try{

      const token =
        localStorage.getItem("accessToken");


      const res = await fetch(
        "/api/customs",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",

            Authorization:`Bearer ${token}`
          },

          body:JSON.stringify({

            ...formData,

            dutyAmount:
              Number(formData.dutyAmount)

          })

        }
      );



      if(res.ok){

        router.push("/customs");

      }


    }catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  }



  return (

    <div className="space-y-6">


      <PageHeader

        title="Create Customs Record"

        description="Register shipment customs clearance."

      />



      <Card title="Customs Information">


        <form

          onSubmit={handleSubmit}

          className="grid gap-5 md:grid-cols-2"

        >



          <div>

            <label className="mb-2 block text-sm font-medium">
              Shipment
            </label>


            <select

              name="shipment"

              value={formData.shipment}

              onChange={handleChange}

              className="w-full rounded-xl border px-4 py-3"

              required

            >

              <option value="">
                Select Shipment
              </option>


              {
                shipments.map((shipment)=>(

                  <option
                    key={shipment._id}
                    value={shipment._id}
                  >

                    {
                      shipment.shipmentNumber
                    }
                    {" - "}
                    {
                      shipment.trackingNumber
                    }

                  </option>

                ))
              }


            </select>


          </div>




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

              className="w-full rounded-xl border px-4 py-3"

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

              className="w-full rounded-xl border px-4 py-3"

              placeholder="Enter remarks..."

            />

          </div>





          <div className="md:col-span-2 flex justify-end">


            <Button
              type="submit"
              loading={loading}
            >

              Create Customs Record

            </Button>


          </div>


        </form>


      </Card>


    </div>

  );

}