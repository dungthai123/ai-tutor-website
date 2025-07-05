import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-muted mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 