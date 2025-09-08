import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { creator_id, bet_amount, game_code, player_one_public_key, status } = await req.json();
  try {
    await prisma.games.create({
      data: {
        creator_id,
        bet_amount: BigInt(bet_amount),
        game_code,
        player_one_public_key,
        status,
      },
    });
    return NextResponse.json({ message: 'Game details saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
