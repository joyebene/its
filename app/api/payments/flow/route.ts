import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { ProductService } from '@/services/product.service';
import { auth } from '@/middleware/auth';
import { IUser } from '@/models/User';

// POST: Complete payment flow from product creation to payment
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await auth(req) as IUser;
        const body = await req.json();
        
        const { productData, paymentData } = body;
        
        // 1. Create product
        const product = await ProductService.create(user, productData);
        
        // 2. Create payment
        const payment = await PaymentService.create(user, {
            ...paymentData,
            productId: product._id.toString()
        });
        
        // 3. Process payment
        const processedPayment = await PaymentService.processPayment(user, {
            paymentId: payment._id.toString()
        });
        
        return NextResponse.json({
            success: true,
            data: {
                product,
                payment: processedPayment,
                message: 'Payment flow completed successfully'
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}