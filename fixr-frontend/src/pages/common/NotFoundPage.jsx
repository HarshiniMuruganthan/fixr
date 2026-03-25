import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950 p-4">
      <div className="text-center animate-in">
        <div className="font-display text-[120px] font-bold leading-none text-gradient mb-2">404</div>
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100 mb-2">Page not found</h1>
        <p className="text-dark-400 dark:text-dark-500 mb-6 max-w-xs mx-auto text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary justify-center">← Back to Home</Link>
      </div>
    </div>
  )
}
