// src/app/api/admin/posts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, published, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    // Use Prisma's generated type with proper typing
    const postData: Prisma.PostCreateInput = {
      title,
      content,
      published: published || false,
      // imageUrl will be conditionally added below
    };

    // Only include imageUrl if it's provided and not empty
    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== '') {
      // Use type assertion for the conditional field
      (postData as Prisma.PostCreateInput & { imageUrl?: string }).imageUrl = imageUrl;
    }

    const newPost = await prisma.post.create({
      data: postData,
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}

// GET function for the admin dashboard
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}