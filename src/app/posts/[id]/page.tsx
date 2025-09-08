// src/app/posts/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CommentForm from '@/components/CommentForm';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
  imageUrl?: string | null;
}

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) throw new Error('Post not found');
      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  if (isLoading) return <p className="text-center py-20">Loading post...</p>;
  if (!post) return <p className="text-center py-20">Post not found.</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link href="/" className="text-orange-700 hover:underline mb-6 inline-block">&larr; Back to all posts</Link>
          {/* Conditionally render the image if it exists */}
        {post.imageUrl && (
            <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-gray-400">
          Published on {new Date(post.createdAt).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </header>
      
      <main className="prose prose-lg max-w-none mb-12">
        <p>{post.content}</p>
      </main>
      
      <section id="comments">
        <h2 className="text-2xl font-bold mb-6">Comments ({post.comments.length})</h2>
        <div className="space-y-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-orange-100 pl-4">
              <p className="font-semibold">{comment.author}</p>
              <p className="text-gray-600 my-1">{comment.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          ))}
        </div>
        <CommentForm postId={post.id} onCommentSubmitted={fetchPost} />
      </section>
    </div>
  );
}