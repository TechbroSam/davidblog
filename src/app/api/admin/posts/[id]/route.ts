// src/app/api/admin/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a single post by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const awaitedParams = await params; // Await params first
    const post = await prisma.post.findUnique({ where: { id: awaitedParams.id } }); // Use awaited params
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// UPDATE a post by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const awaitedParams = await params; // Await params first
    const { title, content, published } = await request.json();
    const updatedPost = await prisma.post.update({
      where: { id: awaitedParams.id }, // Use awaited params
      data: { title, content, published },
    });
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const awaitedParams = await params; // Await params first
    
    // First, delete all comments associated with the post
    await prisma.comment.deleteMany({
      where: { postId: awaitedParams.id }, // Use awaited params
    });
    
    // Then, delete the post itself
    await prisma.post.delete({
      where: { id: awaitedParams.id }, // Use awaited params
    });
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}