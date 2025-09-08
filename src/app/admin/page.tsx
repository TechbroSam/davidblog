// src/app/admin/page.tsx
'use client'; // This page is now interactive

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch all posts from an API route
  const fetchPosts = async () => {
    const res = await fetch('/api/admin/posts');
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, router]);

  const handleDelete = async (postId: string) => {
    // Show a confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/admin/posts/${postId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Remove the post from the local state to update the UI instantly
          setPosts(posts.filter(p => p.id !== postId));
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  if (status === 'loading') return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/create" className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-orange-800">
          Create New Post
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{post.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-GB')} - 
                  <span className={post.published ? 'text-green-600' : 'text-yellow-600'}>
                    {post.published ? ' Published' : ' Draft'}
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/admin/edit/${post.id}`} className="text-blue-600 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}