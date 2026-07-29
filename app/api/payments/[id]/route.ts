// app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { auth } from '@/middleware/auth';
import { IUser } from '@/models/User';

// GET: Get payment by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const payment = await PaymentService.findById(params.id);
        
        return NextResponse.json({ 
            success: true, 
            data: payment 
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 404 }
        );
    }
}

// DELETE: Cancel payment
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        
        const payment = await PaymentService.findById(params.id);
        
        if (payment.status !== 'pending') {
            throw new Error(`Cannot cancel payment with status: ${payment.status}`);
        }
        
        payment.status = 'cancelled';
        payment.updatedBy = user._id;
        await payment.save();
        
        return NextResponse.json({
            success: true,
            data: payment,
            message: 'Payment cancelled successfully'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}