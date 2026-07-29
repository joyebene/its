import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { auth } from '@/middleware/auth';
import { IUser } from '@/models/User';

// GET: Get payment statistics
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        
        const stats = await PaymentService.getStats();
        
        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}