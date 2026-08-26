import { useEffect, useState } from 'react'
import { Check, CircleAlert } from 'lucide-react'
import SendManagementPage from './AuditPlanPage'
import EntryReviewDrawer from './EntryReviewDrawer'
import FinalAuditPlanPage from './FinalAuditPlanPage'

interface ToastState {
  key: number
  message: string
  tone: 'success' | 'error'
}

export default function App() {
  const [page, setPage] = useState<'submission' | 'audit'>('submission')
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
      {page === 'submission' ? (
        <SendManagementPage
          onOpenAudit={() => setPage('audit')}
          onOpenEntry={() => setEntryOpen(true)}
          onNotify={notify}
        />
      ) : (
        <FinalAuditPlanPage
          onBackToSubmission={() => setPage('submission')}
          onOpenEntry={() => setEntryOpen(true)}
          onNotify={notify}
        />
      )}
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
