// src/components/CommentForm.tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onCommentSubmitted: () => void; // A function to refresh the comment list
}

export default function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, author, text }),
      });

      if (res.ok) {
        setAuthor('');
        setText('');
        onCommentSubmitted(); // Refresh the comments list
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 border-t pt-10">
      <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium">Name</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 outline"
          />
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-medium">Comment</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 outline"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-700 px-6 py-2 rounded-md disabled:bg-gray-400"
        >
          {isLoading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </div>
    </form>
  );
}