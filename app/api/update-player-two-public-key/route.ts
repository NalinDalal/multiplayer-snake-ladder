import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { game_code, player_two_public_key } = await req.json();
  try {
    await prisma.games.update({
      where: { game_code },
      data: { player_two_public_key },
    });
    return NextResponse.json({ message: 'Game details updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
