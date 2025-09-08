// src/app/admin/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

// Define the types for our data
interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Post {
  title: string;
  content: string;
  published: boolean;
  imageUrl: string | null;
  comments: Comment[];
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  // Use a single state object for the post data
  const [post, setPost] = useState<Post | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Function to fetch the post and its comments
  const fetchPost = async () => {
    const res = await fetch(`/api/admin/posts/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data.post);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Handle changes to the form fields
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    if(post) {
      setPost({
        ...post,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsLoading(true);

    let imageUrl = post.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      imageUrl = data.url;
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, imageUrl }),
      });
      if (res.ok) router.push('/admin');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const res = await fetch(`/api/admin/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPost(); // Re-fetch the post to refresh the comments list
      } else {
        alert('Failed to delete comment.');
      }
    }
  };

  if (!post) return <p className="text-center py-20">Loading post...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <button onClick={() => router.push('/admin')} className="text-sm text-gray-600 hover:underline">
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Post Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input id="title" name="title" type="text" value={post.title} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium">Featured Image</label>
          {post.imageUrl && (
            <div className="mt-2 relative w-48 h-32 rounded-md overflow-hidden">
              <Image src={post.imageUrl} alt="Current image" fill className="object-cover" />
            </div>
          )}
          <input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-2 block w-full text-sm text-gray-500" />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea id="content" name="content" value={post.content} onChange={handleFormChange} required rows={10} className="mt-1 block w-full rounded-md border-gray-300" />
        </div>
        <div className="flex items-center">
          <input id="published" name="published" type="checkbox" checked={post.published} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="published" className="ml-2 block text-sm">Publish post</label>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-orange-700 text-white py-2 rounded-md disabled:bg-gray-400">
          {isLoading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
      
      {/* Comments Moderation Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold border-t pt-8">Comments on this Post</h2>
        <div className="mt-6 space-y-6 bg-white p-6 rounded-lg shadow-md">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.author}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString('en-GB')}
                    </p>
                    <p className="mt-2 text-gray-700">{comment.text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments on this post yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}