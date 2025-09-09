// src/app/admin/edit/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

interface Comment { id: string; author: string; text: string; createdAt: string; }
interface Post { title: string; content: string; published: boolean; imageUrl: string | null; comments: Comment[]; }

interface EditPageProps { params: { id: string }; }

export default function EditPostPage({ params }: EditPageProps) {
  const { id } = params; // Directly access the id
  const [post, setPost] = useState<Post | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchPost = useCallback(async () => {
    const res = await fetch(`/api/admin/posts/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data.post);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    if(post) {
      setPost({ ...post, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsLoading(true);
    let imageUrlToUpdate = post.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        imageUrlToUpdate = data.url;
      } else {
        alert('Image upload failed.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, imageUrl: imageUrlToUpdate }),
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
        fetchPost();
      } else {
        alert('Failed to delete comment.');
      }
    }
  };

  if (!post) return <p className="text-center py-20">Loading post...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" value={post.title} onChange={handleFormChange} required />
        </div>
        <div>
          <label>Featured Image</label>
          {post.imageUrl && (
            <div className="mt-2 relative w-48 h-32">
              <Image src={post.imageUrl} alt="Current image" fill className="object-cover" />
            </div>
          )}
          <input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" value={post.content} onChange={handleFormChange} required rows={10} />
        </div>
        <div>
          <input id="published" name="published" type="checkbox" checked={post.published} onChange={handleFormChange} />
          <label htmlFor="published">Publish post</label>
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Post'}</button>
      </form>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div>
          {post.comments?.map((comment) => (
            <div key={comment.id}>
              <p>{comment.author}</p>
              <p>{comment.text}</p>
              <button onClick={() => handleDeleteComment(comment.id)}><Trash2 /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}