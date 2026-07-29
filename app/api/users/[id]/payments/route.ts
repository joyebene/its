import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { auth } from '@/middleware/auth';
import { IUser } from '@/models/User';

// GET: Get all payments for a specific user
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        
        // Check if user is requesting their own payments or is admin
        if (user._id.toString() !== params.userId && 
            user.role !== 'ADMIN' && 
            user.role !== 'SUPER_ADMIN') {
            throw new Error("Unauthorized to view these payments");
        }
        
        const payments = await PaymentService.findByUser(params.userId);
        
        return NextResponse.json({
            success: true,
            data: payments
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.message === "Unauthorized to view these payments" ? 403 : 500 }
        );
    }
}