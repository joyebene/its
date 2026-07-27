import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { auth } from "@/middleware/auth";

import {
  NotificationService,
} from "@/services/notification.service";


import {
  success,
  error,
} from "@/utils/api-response";



export async function GET(
  req: NextRequest
) {

  try {


    await connectDB();


    const user =
      await auth(req);



    const notifications =
      await NotificationService.findAll(
        user
      );



    return success(
      notifications
    );



  } catch(err:any) {


    return error(
      err.message,
      400
    );


  }

}