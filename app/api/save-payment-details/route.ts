import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId, user_public_key, amount, status, payment_signature, game_code } = await req.json();
  if (!userId || !amount || !status || !game_code) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    await prisma.payments.create({
      data: {
        user_id: userId,
        user_public_key,
        amount: BigInt(amount),
        status,
        payment_signature,
        game_code,
      },
    });
    return NextResponse.json({ message: 'Payment details updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
