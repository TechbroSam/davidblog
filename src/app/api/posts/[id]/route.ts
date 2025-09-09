// src/app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note the Promise wrapper
) {
  try {
    const awaitedParams = await params; // Await the params first
    const post = await prisma.post.findUnique({
      where: { id: awaitedParams.id }, // Use the awaited params
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post.' }, { status: 500 });
  }
}