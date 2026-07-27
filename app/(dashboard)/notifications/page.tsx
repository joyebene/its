"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
} from "lucide-react";


interface Notification {

  _id: string;

  title: string;

  message: string;

  type:
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

  isRead: boolean;

  createdAt: string;

}



export default function NotificationsPage() {


  const [notifications, setNotifications] =
    useState<Notification[]>([]);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    fetchNotifications();

  }, []);



  async function fetchNotifications() {

    try {


      const token =
        localStorage.getItem(
          "accessToken"
        );


      const res =
        await fetch(
          "/api/notifications",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const result =
        await res.json();



      if (res.ok) {

        setNotifications(
          result.data
        );

      }


    } catch (err) {

      console.error(err);

    }
    finally {

      setLoading(false);

    }

  }




  function getIcon(type: string) {

    switch (type) {

      case "SUCCESS":

        return (
          <CheckCircle
            className="text-green-600"
          />
        );


      case "WARNING":

        return (
          <AlertTriangle
            className="text-yellow-600"
          />
        );


      case "ERROR":

        return (
          <XCircle
            className="text-red-600"
          />
        );


      default:

        return (
          <Info
            className="text-blue-600"
          />
        );

    }

  }



  if (loading) {

    return (
      <p>
        Loading notifications...
      </p>
    );

  }



  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>


        <p className="text-gray-500">
          Stay updated with shipment activities
        </p>

      </div>



      <div className="space-y-4">


        {
          notifications.length === 0 ?

            (
              <div className="rounded-xl border bg-white p-5">
                No notifications found.
              </div>
            )

            :

            notifications.map((notification) => (


              <div
                key={notification._id}
                className={`
                            rounded-xl border bg-white p-5 flex gap-4
                            ${!notification.isRead
                    ? "border-blue-300"
                    : ""
                  }
                            `}
              >


                <div>

                  {
                    getIcon(
                      notification.type
                    )
                  }

                </div>



                <div>


                  <h3 className="font-semibold">

                    {
                      notification.title
                    }

                  </h3>


                  <p className="text-gray-500">

                    {
                      notification.message
                    }

                  </p>


                  <span className="text-sm text-gray-400">

                    {
                      new Date(
                        notification.createdAt
                      )
                        .toLocaleString()
                    }

                  </span>


                </div>



              </div>


            ))

        }



      </div>


    </div>

  );

}