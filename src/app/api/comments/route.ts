// src/app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { postId, author, text } = await request.json();

    if (!postId || !author || !text) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        author,
        text,
      },
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment.' }, { status: 500 });
  }
}