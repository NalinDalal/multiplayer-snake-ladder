import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { id, name, email } = await req.json();

  try {
    await prisma.users.upsert({
      where: { id },
      update: { name, email },
      create: { id, name, email },
    });
    return NextResponse.json({ message: 'User saved successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
