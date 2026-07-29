import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PaymentService } from '@/services/payment.service';
import { paymentWebhookSchema } from '@/schema/payment.schema';

// POST: Webhook handler for payment gateways (No authentication required)
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Verify webhook signature in production
        // const signature = req.headers.get('x-webhook-signature');
        // await verifyWebhookSignature(signature, body);
        
        const validatedData = paymentWebhookSchema.parse(body);
        const payment = await PaymentService.processWebhook(validatedData);
        
        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully',
            data: payment
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}