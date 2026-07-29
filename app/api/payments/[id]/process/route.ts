import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { auth } from '@/middleware/auth';
import { processPaymentSchema } from '@/schema/payment.schema';
import { IUser } from '@/models/User';

// POST: Process a payment
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        const body = await req.json();
        
        const validatedData = processPaymentSchema.parse({
            ...body,
            paymentId: params.id
        });
        
        const payment = await PaymentService.processPayment(user, validatedData);
        
        return NextResponse.json({
            success: true,
            data: payment,
            message: 'Payment processed successfully'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}