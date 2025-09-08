import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payments = await prisma.payments.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const formattedPayments = payments.map(payment => ({
      ...payment,
      amount: payment.amount.toString(),
    }));
    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
