import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const features = [
  { icon: '🔧', title: 'Post Any Repair', desc: 'Describe your problem, set your budget, and get bids from verified technicians fast.' },
  { icon: '⚡', title: 'Instant Bidding', desc: 'Technicians compete for your job, so you always get a fair price.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Communicate directly with your chosen technician before and during the job.' },
  { icon: '⭐', title: 'Verified Reviews', desc: 'Browse ratings left by real customers so you can choose with confidence.' },
]
const categories = ['Electronics', 'Plumbing', 'Electrical', 'HVAC', 'Appliances', 'Carpentry', 'Auto', 'Mobile']

export default function LandingPage() {
  const { user } = useAuth()
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-30 glass border-b border-dark-100 dark:border-dark-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-white font-display font-bold text-sm">F</div>
            <span className="font-display font-bold text-dark-900 dark:text-dark-100 text-lg">Fixr</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="btn-ghost p-2 rounded-lg text-sm">{dark ? '☀' : '🌙'}</button>
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium mb-6 border border-brand-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
            Trusted by 10,000+ customers across 50 cities
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-dark-900 dark:text-dark-50 leading-tight mb-5">
            Get Any Repair Done
            <span className="block text-gradient">Fast & Reliably</span>
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Post your repair request, receive competitive bids from verified local technicians, and chat in real-time. Fixed, guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary px-7 py-3 text-base justify-center">
              Post a Repair Request
            </Link>
            <Link to="/register?role=technician" className="btn-secondary px-7 py-3 text-base justify-center">
              Join as Technician
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white dark:bg-dark-900/40 border-y border-dark-100 dark:border-dark-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-medium text-dark-400 dark:text-dark-500 uppercase tracking-widest mb-6">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map(cat => (
              <span key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-dark-900 dark:text-dark-100 mb-3">Everything you need in one platform</h2>
            <p className="text-dark-400 dark:text-dark-500">From posting a request to completing the job — streamlined end to end.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="card card-hover p-5 animate-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-1.5">{f.title}</h3>
                <p className="text-dark-400 dark:text-dark-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-cyan-500/5 pointer-events-none" />
            <h2 className="font-display text-3xl font-bold text-dark-900 dark:text-dark-100 mb-3">Ready to get started?</h2>
            <p className="text-dark-400 dark:text-dark-500 mb-6">Join thousands of customers and technicians already on Fixr.</p>
            <Link to="/register" className="btn-primary px-8 py-3 text-base justify-center">
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-100 dark:border-dark-800 py-6 px-4 text-center text-xs text-dark-400 dark:text-dark-600">
        © {new Date().getFullYear()} Fixr Repair Marketplace. All rights reserved.
      </footer>
    </div>
  )
}
