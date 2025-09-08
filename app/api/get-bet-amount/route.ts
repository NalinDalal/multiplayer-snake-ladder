import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json({ message: 'Missing gameId' }, { status: 400 });
  }

  const game = await prisma.games.findFirst({
    where: { game_code: gameId },
  });

  if (!game) {
    return NextResponse.json({ message: 'No game found' }, { status: 404 });
  }

  const amount = Number(game.bet_amount) / 1_000_000_000;

  return NextResponse.json({ bet_amount: amount.toString() });
}
