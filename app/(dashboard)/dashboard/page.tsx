import {
  Package,
  Ship,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Truck,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/shared/Card";

export default function DashboardPage() {

  const activities = [
    {
        title: "Container MSKU1234567 arrived",
        description: "Lagos Port - Customs inspection pending",
        time: "10 minutes ago",
        icon: Ship,
    },

    {
        title: "Shipment SHP-1002 cleared",
        description: "Customs duty payment completed",
        time: "1 hour ago",
        icon: CheckCircle2,
    },

    {
        title: "Delivery assigned",
        description: "Driver assigned to shipment SHP-1005",
        time: "3 hours ago",
        icon: Truck,
    },

    {
        title: "New container added",
        description: "Container OOLU8877665 registered",
        time: "Yesterday",
        icon: Package,
    },

    {
        title: "Shipment location updated",
        description: "Shipment is currently in transit",
        time: "Yesterday",
        icon: MapPin,
    },
];

  return (
    <>
      <DashboardHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Shipments"
          value="128"
          change="+12% this month"
          icon={Package}
        />

        <StatCard
          title="In Transit"
          value="36"
          change="18 Active"
          icon={Ship}
        />

        <StatCard
          title="Delivered"
          value="74"
          change="+8 this week"
          icon={CheckCircle2}
        />

        <StatCard
          title="Pending Customs"
          value="14"
          change="Needs attention"
          icon={ShieldCheck}
        />

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">


        {/* Recent Activities */}
        <Card title="Recent Activities">


          <div className="space-y-5">


            {activities.map((activity, index) => {

              const Icon = activity.icon;


              return (

                <div
                  key={index}
                  className="flex items-start gap-4"
                >

                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">

                    <Icon size={20} />

                  </div>


                  <div>

                    <p className="font-semibold text-slate-800">
                      {activity.title}
                    </p>


                    <p className="text-sm text-slate-500">
                      {activity.description}
                    </p>


                    <p className="mt-1 text-xs text-slate-400">
                      {activity.time}
                    </p>

                  </div>


                </div>

              )

            })}


          </div>


        </Card>




        {/* Shipment Overview */}
        <Card title="Shipment Overview">


          <div className="space-y-5">


            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm">
                  In Transit
                </span>

                <span className="font-semibold">
                  36
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">

                <div className="h-2 w-[60%] rounded-full bg-blue-600" />

              </div>

            </div>



            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm">
                  Customs Pending
                </span>

                <span className="font-semibold">
                  14
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">

                <div className="h-2 w-[30%] rounded-full bg-yellow-500" />

              </div>

            </div>




            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm">
                  Delivered
                </span>

                <span className="font-semibold">
                  74
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">

                <div className="h-2 w-[80%] rounded-full bg-green-600" />

              </div>

            </div>



          </div>


        </Card>


      </div>


    </>
  );
}