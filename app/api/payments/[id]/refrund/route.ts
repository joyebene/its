import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { auth } from '@/middleware/auth';
import { refundPaymentSchema } from '@/schema/payment.schema';
import { IUser } from '@/models/User';

// POST: Refund a payment
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        const body = await req.json();
        
        const validatedData = refundPaymentSchema.parse(body);
        const payment = await PaymentService.refundPayment(
            params.id,
            user,
            validatedData
        );
        
        return NextResponse.json({
            success: true,
            data: payment,
            message: 'Payment refunded successfully'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}