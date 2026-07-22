"use client";


import {
    useState
} from "react";


import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";


export default function SettingsPage() {


    const [loading, setLoading] = useState(false);



    return (

        <div className="space-y-6">


            <PageHeader

                title="Settings"

                description="Manage your account and system preferences."

            />




            <Card title="Profile Information">


                <div className="grid gap-5 md:grid-cols-2">


                    <Input

                        label="Full Name"

                        name="name"

                        defaultValue="John Admin"

                    />



                    <Input

                        label="Email"

                        name="email"

                        defaultValue="admin@cargo.com"

                    />



                    <Input

                        label="Phone"

                        name="phone"

                    />


                </div>



                <div className="mt-6 flex justify-end">


                    <Button className="md:w-1/4">

                        Save Changes

                    </Button>


                </div>



            </Card>





            <Card title="Security">


                <div className="grid gap-5 md:grid-cols-2">


                    <Input

                        label="Current Password"

                        name="password"

                        type="password"

                    />



                    <Input

                        label="New Password"

                        name="newPassword"

                        type="password"

                    />



                </div>



                <div className="mt-6 flex justify-end">


                    <Button className="md:w-1/4">

                        Update Password

                    </Button>


                </div>


            </Card>




        </div>

    )

}