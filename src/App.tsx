import { useEffect, useState } from 'react'
import { Check, CircleAlert } from 'lucide-react'
import AuditPlanPage from './AuditPlanPage'
import EntryReviewDrawer from './EntryReviewDrawer'

interface ToastState {
  key: number
  message: string
  tone: 'success' | 'error'
}

export default function App() {
  const [entryOpen, setEntryOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ key: Date.now(), message, tone })
  }

  return (
    <div className="app-shell">
      <AuditPlanPage onOpenEntry={() => setEntryOpen(true)} onNotify={notify} />
      <EntryReviewDrawer
        open={entryOpen}
        onClose={() => setEntryOpen(false)}
        onNotify={notify}
      />

      {toast && (
        <div className={`toast is-${toast.tone}`} role="status" key={toast.key}>
          <span className="toast-icon">
            {toast.tone === 'success' ? <Check size={15} /> : <CircleAlert size={15} />}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}
