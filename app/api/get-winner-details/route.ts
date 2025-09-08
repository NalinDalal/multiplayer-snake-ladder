import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const gameId = searchParams.get('gameId');
  const userId = searchParams.get('userId');

  if (!gameId || !userId) {
    return NextResponse.json({ message: 'Missing gameId or userId' }, { status: 400 });
  }

  const game = await prisma.games.findFirst({
    where: {
      AND: [
        { game_code: gameId },
        {
          OR: [
            { creator_id: userId },
            { player_two_id: userId },
          ],
        },
      ],
    },
  });

  if (!game) {
    return NextResponse.json({ message: 'No details found' }, { status: 404 });
  }

  let role = 'unknown';
  if (game.creator_id === userId) {
    role = 'creator';
  } else if (game.player_two_id === userId) {
    role = 'player_two';
  }

  // Ensure BigInt literals are compatible
  const betAmount = BigInt(game.bet_amount.toString());
  const doubled = betAmount * BigInt(2);
  const cut = doubled * BigInt(3) / BigInt(100);
  const wining_amount = doubled - cut;

  return NextResponse.json({
    winner_public_key: role === 'creator' ? game.player_one_public_key : game.player_two_public_key,
    wining_amount: wining_amount.toString(),
    bet_amount: betAmount.toString(),
  });
}
