import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { IUser } from '@/models/User';
import { createPaymentSchema } from '@/schema/payment.schema';
import { auth } from '@/middleware/auth';
import { Payment, Product } from '@/models';
import { PaymentStatus } from '@/models/Payment';

// GET: Get all payments for a specific product
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;

        const { id } = await params;

        const payments = await PaymentService.findByProduct(id);

        return NextResponse.json({
            success: true,
            data: payments
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST: Create payment for a specific product
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        const body = await req.json();

        const { id } = await params;

        const validatedData = createPaymentSchema.parse({
            ...body,
            productId: id
        });

        const payment = await PaymentService.create(user, validatedData);

        return NextResponse.json(
            { success: true, data: payment },
            { status: 201 }
        );
    } catch (error: any) {
        console.log("PAYMENT ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: {
        params: Promise<{
            id: string;
        }>
    }
) {

    try {

        await connectDB();


        const user = await auth(req) as IUser;

        const { paymentId } = await req.json();


        const { id } = await params;


        const payment = await Payment.findById(paymentId);
 console.log(payment);

        if (!payment) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Payment not found"
                },
                {
                    status: 404
                }
            );

        }



        payment.status = PaymentStatus.COMPLETED;
        payment.completedAt = new Date();

        await payment.save();



        // update product payment status

        await Product.findByIdAndUpdate(
            id,
            {
                paymentStatus: "PAID"
            }
        );



        return NextResponse.json({

            success: true,
            message: "Payment cleared",
            data: payment

        });



    } catch (error: any) {
         console.log(error);

        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 400
            }
        );

    }

}