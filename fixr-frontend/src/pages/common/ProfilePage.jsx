import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../../components/ui'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.location?.city || '',
    area: user?.location?.area || '',
    service: user?.service || '',
    bio: user?.bio || '',
    yearsOfExperience: user?.yearsOfExperience || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    const res = await updateProfile(form)
    if (res.success) {
      // Form values are already updated in state via onChange
    }
  }

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Profile Settings</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar section */}
      <div className="card p-5 mb-5 flex items-center gap-4 animate-in stagger-1">
        <Avatar name={user?.name} size="lg" />
        <div>
          <p className="font-display font-semibold text-dark-900 dark:text-dark-100">{user?.name}</p>
          <p className="text-sm text-dark-400 dark:text-dark-500">{user?.email}</p>
          <span className={`badge mt-1.5 ${
            user?.role === 'admin' ? 'badge-red' : user?.role === 'technician' ? 'badge-blue' : 'badge-green'
          } capitalize`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 animate-in stagger-2">
        <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="Your city" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div>
              <label className="label">Area</label>
              <input className="input" placeholder="Your area/district" value={form.area} onChange={e => set('area', e.target.value)} />
            </div>
          </div>

          {user?.role === 'technician' && (
            <>
              <div>
                <label className="label">Primary Service</label>
                <input className="input" placeholder="e.g. Electronics, Plumbing" value={form.service} onChange={e => set('service', e.target.value)} />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input className="input" type="number" min="0" placeholder="5" value={form.yearsOfExperience} onChange={e => set('yearsOfExperience', e.target.value)} />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea
                  className="input min-h-[100px] resize-none"
                  placeholder="Tell customers about yourself and your expertise…"
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-dark-100 dark:border-dark-800 flex justify-end">
          <button onClick={handleSave} className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5 mt-5 animate-in stagger-3">
        <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 text-sm mb-3">Account Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-400 dark:text-dark-500">User ID</span>
            <span className="font-mono text-xs text-dark-600 dark:text-dark-400">{user?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-400 dark:text-dark-500">Role</span>
            <span className="capitalize text-dark-700 dark:text-dark-300">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
