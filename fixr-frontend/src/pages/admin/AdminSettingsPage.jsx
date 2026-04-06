import { useState, useEffect } from 'react'
import { adminAPI } from '../../api/admin'
import { Spinner } from '../../components/ui'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await adminAPI.getSettings()
      setSettings(data)
    } catch { toast.error('Failed to load settings') }
    finally { setLoading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminAPI.updateSettings(settings)
      toast.success('Settings updated')
    } catch { toast.error('Failed to save settings') }
    finally { setSaving(false) }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto">
      <div className="mb-6 animate-in">
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-dark-100">Site Settings</h1>
        <p className="text-sm text-dark-400 dark:text-dark-500 mt-0.5">Control global platform configurations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 animate-in stagger-1">
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 mb-2">General Info</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Site Name</label>
              <input name="siteName" className="input" value={settings.siteName} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Support Email</label>
                <input name="siteEmail" className="input" value={settings.siteEmail} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Support Phone</label>
                <input name="sitePhone" className="input" value={settings.sitePhone} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-dark-900 dark:text-dark-100 mb-2">Platform Controls</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50 cursor-pointer">
              <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="w-5 h-5 rounded-md text-brand-600 focus:ring-brand-500" />
              <div>
                <p className="text-sm font-medium text-dark-900 dark:text-dark-100">Maintenance Mode</p>
                <p className="text-xs text-dark-400">If enabled, the site will show a maintenance page to users</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50 cursor-pointer">
              <input type="checkbox" name="allowNewUsers" checked={settings.allowNewUsers} onChange={handleChange} className="w-5 h-5 rounded-md text-brand-600 focus:ring-brand-500" />
              <div>
                <p className="text-sm font-medium text-dark-900 dark:text-dark-100">Allow New Registrations</p>
                <p className="text-xs text-dark-400">Whether new users can sign up on the platform</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="btn btn-brand min-w-[120px]">
             {saving ? <Spinner size="sm" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
