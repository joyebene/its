// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { createPaymentSchema, paymentFiltersSchema } from '@/schema/payment.schema';
import { IUser } from '@/models/User';
import { auth } from '@/middleware/auth';

// GET: Get all payments with filters
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        
        const { searchParams } = new URL(req.url);
        const filters: any = {};
        
        if (searchParams.get('status')) filters.status = searchParams.get('status');
        if (searchParams.get('method')) filters.method = searchParams.get('method');
        if (searchParams.get('gateway')) filters.gateway = searchParams.get('gateway');
        if (searchParams.get('productId')) filters.productId = searchParams.get('productId');
        if (searchParams.get('userId')) filters.userId = searchParams.get('userId');
        if (searchParams.get('search')) filters.search = searchParams.get('search');
        if (searchParams.get('fromDate')) filters.fromDate = new Date(searchParams.get('fromDate')!);
        if (searchParams.get('toDate')) filters.toDate = new Date(searchParams.get('toDate')!);
        
        const validatedFilters = paymentFiltersSchema.parse(filters);
        const payments = await PaymentService.findAll(user, validatedFilters);
        
        return NextResponse.json({ 
            success: true, 
            data: payments 
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: error.status || 500 }
        );
    }
}

// POST: Create a new payment
export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        const body = await req.json();
        
        const validatedData = createPaymentSchema.parse(body);
        const payment = await PaymentService.create(user, validatedData);
        
        return NextResponse.json(
            { success: true, data: payment },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}