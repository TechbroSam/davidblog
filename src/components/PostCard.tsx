// src/components/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  imageUrl?: string | null;
  createdAt: string;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/posts/${post.id}`}>
        {post.imageUrl && (
          <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <p className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
        <h3 className="text-xl font-bold mt-1 group-hover:text-orange-700 transition-colors">
          {post.title}
        </h3>
      </Link>
    </article>
  );
}