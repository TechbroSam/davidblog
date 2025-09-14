// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '@/components/PostCard'; // Import our new component

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string | null;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const latestPost = posts[0];
  const olderPosts = posts.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Hi, I&apos;m David Samora
        </h1>
        <p className="mt-4 text-lg text-gray-500">Welcome to my space, where I share my thoughts and experiences in the form of motivational quotes.</p>
      </header>
      
      <main>
        {isLoading && <p className="text-center">Loading posts...</p>}
        {!isLoading && posts.length === 0 && <p className="text-center">No posts yet. Check back soon!</p>}

        {latestPost && (
          <section id="latest-post" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Latest Post</h2>
            <Link href={`/posts/${latestPost.id}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {latestPost.imageUrl && (
                <div className="relative h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={latestPost.imageUrl}
                    alt={latestPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(latestPost.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="text-3xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                  {latestPost.title}
                </h3>
                <p className="text-gray-600 line-clamp-4 mt-4">
                  {latestPost.content}
                </p>
                <span className="text-green-700 font-semibold hover:underline mt-4 inline-block">
                  Read more &rarr;
                </span>
              </div>
            </Link>
          </section>
        )}

        {olderPosts.length > 0 && (
          <section id="older-posts">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Older Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {olderPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}