import { useEffect, useMemo, useState, type ComponentType } from 'react'
import {
  BadgeCheck,
  Boxes,
  Calculator,
  ClipboardCheck,
  Files,
  HardHat,
  Landmark,
  Menu,
  MonitorCog,
  ReceiptText,
  Recycle,
  Ruler,
  Save,
  Send,
  X,
} from 'lucide-react'
import {
  entryInitialValues,
  entryReviewSections,
  submitFields,
  type EntrySectionDefinition,
} from './data'
import { FieldGrid } from './FormField'
import { useAnchorNavigation } from './useAnchorNavigation'

const entryAnchorIds = [
  'entry-submit',
  'entry-audit',
  ...entryReviewSections.map((section) => `entry-${section.id}`),
]

const sectionIcons: Record<EntrySectionDefinition['icon'], ComponentType<{ size?: number }>> = {
  calculator: Calculator,
  'hard-hat': HardHat,
  ruler: Ruler,
  'clipboard-check': ClipboardCheck,
  boxes: Boxes,
  'monitor-cog': MonitorCog,
  'receipt-text': ReceiptText,
  recycle: Recycle,
  landmark: Landmark,
}

function PrimaryAnchorHeading({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ size?: number }>
  title: string
}) {
  return (
    <div className="primary-anchor-heading">
      <span className="primary-anchor-icon"><Icon size={18} /></span>
      <h2>{title}</h2>
    </div>
  )
}

function EntrySidebar({
  activeAnchor,
  onNavigate,
  onCloseMobile,
}: {
  activeAnchor: string
  onNavigate: (id: string) => void
  onCloseMobile: () => void
}) {
  const reviewIsActive = activeAnchor !== 'entry-submit'
  const navigate = (id: string) => {
    onNavigate(id)
    onCloseMobile()
  }

  return (
    <aside className="entry-sidebar" aria-label="录入审定信息业务导航">
      <div className="directory-label">业务阶段</div>
      <nav className="anchor-nav">
        <button
          type="button"
          className={`anchor-primary${activeAnchor === 'entry-submit' ? ' is-active' : ''}`}
          onClick={() => navigate('entry-submit')}
        >
          <Send size={16} />
          <span>送审信息</span>
        </button>

        <button
          type="button"
          className={`anchor-primary${reviewIsActive ? ' is-active' : ''}`}
          onClick={() => navigate('entry-audit')}
        >
          <BadgeCheck size={16} />
          <span>审定信息</span>
        </button>

        <div className="anchor-secondary-group">
          {entryReviewSections.map((section) => {
            const anchorId = `entry-${section.id}`
            return (
              <button
                type="button"
                key={section.id}
                className={`anchor-secondary${activeAnchor === anchorId ? ' is-active' : ''}`}
                aria-current={activeAnchor === anchorId ? 'location' : undefined}
                onClick={() => navigate(anchorId)}
              >
                <span className="nav-dot" aria-hidden="true" />
                <span>{section.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export default function EntryReviewDrawer({
  open,
  onClose,
  onNotify,
}: {
  open: boolean
  onClose: () => void
  onNotify: (message: string, tone?: 'success' | 'error') => void
}) {
  const [values, setValues] = useState(entryInitialValues)
  const [savedValues, setSavedValues] = useState(entryInitialValues)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const anchors = useMemo(() => entryAnchorIds, [])
  const { activeAnchor, registerSection, scrollRef, scrollToAnchor } =
    useAnchorNavigation(anchors, 'entry-submit', open)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const updateValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }))
  }

  const cancelChanges = () => {
    setValues(savedValues)
    onNotify('已恢复到上次保存的内容')
  }

  const saveChanges = () => {
    setSavedValues(values)
    onNotify('录入审定信息已保存')
  }

  return (
    <div className="entry-layer" role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <button type="button" className="entry-scrim" aria-label="关闭录入审定信息" onClick={onClose} />
      <section className="entry-panel">
        <header className="entry-header">
          <button
            type="button"
            className="icon-button entry-menu-button"
            title="业务导航"
            aria-label="打开业务导航"
            onClick={() => setMobileNavOpen((current) => !current)}
          >
            <Menu size={18} />
          </button>
          <h1 id="entry-title">录入审定信息</h1>
          <button type="button" className="icon-button" title="关闭" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="entry-body">
          <button
            type="button"
            className={`mobile-nav-backdrop${mobileNavOpen ? ' is-open' : ''}`}
            aria-label="关闭业务导航"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className={`entry-sidebar-wrap${mobileNavOpen ? ' is-open' : ''}`}>
            <EntrySidebar
              activeAnchor={activeAnchor}
              onNavigate={scrollToAnchor}
              onCloseMobile={() => setMobileNavOpen(false)}
            />
          </div>

          <main className="entry-workspace">
            <div className="entry-scroll-area" ref={scrollRef}>
              <section className="entry-anchor-block" ref={registerSection('entry-submit')}>
                <PrimaryAnchorHeading icon={Send} title="送审信息" />
                <div className="entry-submit-card">
                  <FieldGrid fields={submitFields} values={values} onChange={updateValue} />
                </div>
              </section>

              <section className="entry-primary-divider" ref={registerSection('entry-audit')}>
                <PrimaryAnchorHeading icon={BadgeCheck} title="审定信息" />
              </section>

              {entryReviewSections.map((section) => {
                const SectionIcon = sectionIcons[section.icon]
                return (
                  <section
                    className="entry-review-card"
                    key={section.id}
                    ref={registerSection(`entry-${section.id}`)}
                  >
                    <div className="secondary-section-heading">
                      <span className="secondary-section-icon"><SectionIcon size={18} /></span>
                      <h3>{section.label}</h3>
                    </div>

                    {section.contracts ? (
                      <div className="entry-contract-list">
                        {section.contracts.map((contract, index) => (
                          <div className="entry-contract-group" key={contract.id}>
                            {index > 0 && <div className="repeated-group-divider" aria-hidden="true" />}
                            <div className="entry-contract-card">
                              <div className="tertiary-heading">
                                <span className="tertiary-icon"><Files size={16} /></span>
                                <h4>{contract.label}</h4>
                              </div>
                              <FieldGrid
                                contract
                                fields={contract.fields}
                                values={values}
                                onChange={updateValue}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <FieldGrid fields={section.fields ?? []} values={values} onChange={updateValue} />
                    )}
                  </section>
                )
              })}
              <div className="scroll-end-space" aria-hidden="true" />
            </div>

            <footer className="entry-footer">
              <button type="button" className="secondary-button" onClick={cancelChanges}>
                <X size={15} />
                取消
              </button>
              <button type="button" className="primary-button" onClick={saveChanges}>
                <Save size={15} />
                保存
              </button>
            </footer>
          </main>
        </div>
      </section>
    </div>
  )
}
