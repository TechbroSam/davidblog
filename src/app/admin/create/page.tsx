// src/app/admin/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl: string | undefined = undefined;

    // 1. Upload the image if one is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      imageUrl = data.url;
    }

    // 2. Create the post with the image URL
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, published, imageUrl }),
      });
      if (res.ok) router.push('/admin');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 outline" />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium">Featured Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} className="mt-1 block w-full rounded-md border-gray-300 outline" />
        </div>
        <div className="flex items-center">
          <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="published" className="ml-2 block text-sm">Publish post</label>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-orange-700 py-2 rounded-md disabled:bg-gray-400">
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}