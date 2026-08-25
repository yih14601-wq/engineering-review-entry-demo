import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Save,
  Search,
  Send,
  X,
} from 'lucide-react'
import {
  initialValues,
  pages,
  reviewPages,
  type FieldDefinition,
  type PageDefinition,
} from './data'

type Toast = { message: string; key: number } | null

const formatAmount = (value: number) =>
  value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

function AmountStepper({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition
  value: string
  onChange: (next: string) => void
}) {
  const parsedValue = Number(value.replace(/,/g, '')) || 0
  const step = field.step ?? 1000

  const updateBy = (direction: 1 | -1) => {
    onChange(formatAmount(Math.max(0, parsedValue + direction * step)))
  }

  return (
    <div className="amount-control">
      <input
        id={field.id}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="amount-unit">元</span>
      <div className="stepper-buttons">
        <button
          type="button"
          title={`增加 ${step} 元`}
          aria-label={`增加 ${step} 元`}
          onClick={() => updateBy(1)}
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          title={`减少 ${step} 元`}
          aria-label={`减少 ${step} 元`}
          onClick={() => updateBy(-1)}
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  )
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition
  value: string
  onChange: (next: string) => void
}) {
  if (field.kind === 'amount') {
    return (
      <div className="form-field">
        <label htmlFor={field.id}>{field.label}</label>
        <AmountStepper field={field} value={value} onChange={onChange} />
      </div>
    )
  }

  if (field.kind === 'readonly') {
    return (
      <div className="form-field">
        <label htmlFor={field.id}>{field.label}</label>
        <div className="readonly-control" id={field.id} tabIndex={0} aria-readonly="true">
          <span>{value}</span>
          <LockKeyhole size={16} aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className="form-field">
      <label htmlFor={field.id}>{field.label}</label>
      <div className={field.kind === 'date' ? 'date-control' : 'plain-control'}>
        <input
          id={field.id}
          type={field.kind === 'date' ? 'date' : field.kind === 'number' ? 'number' : 'text'}
          inputMode={field.kind === 'number' ? 'decimal' : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.kind === 'date' && <CalendarDays size={16} aria-hidden="true" />}
      </div>
    </div>
  )
}

function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FieldDefinition[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  return (
    <div className="field-grid">
      {fields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id] ?? ''}
          onChange={(value) => onChange(field.id, value)}
        />
      ))}
    </div>
  )
}

function Sidebar({
  activePage,
  expanded,
  onExpandedChange,
  onPageChange,
}: {
  activePage: PageDefinition
  expanded: boolean
  onExpandedChange: (value: boolean) => void
  onPageChange: (pageId: string) => void
}) {
  const isSubmit = activePage.group === 'submit'

  return (
    <aside className="business-sidebar" aria-label="业务阶段导航">
      <div className="sidebar-label">业务阶段</div>
      <nav>
        <button
          type="button"
          className={`primary-nav ${isSubmit ? 'is-active' : ''}`}
          onClick={() => onPageChange('submit')}
        >
          <Send size={16} />
          <span>送审信息</span>
          <ChevronRight className="nav-spacer-icon" size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`primary-nav ${!isSubmit ? 'is-active' : ''}`}
          aria-expanded={expanded}
          onClick={() => {
            if (isSubmit) {
              onExpandedChange(true)
              onPageChange('overall-review')
            } else {
              onExpandedChange(!expanded)
            }
          }}
        >
          <CircleCheck size={16} />
          <span>审定信息</span>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {expanded && (
          <div className="secondary-nav">
            {reviewPages.map((page) => (
              <button
                type="button"
                key={page.id}
                className={page.id === activePage.id ? 'is-active' : ''}
                aria-current={page.id === activePage.id ? 'location' : undefined}
                onClick={() => onPageChange(page.id)}
              >
                <span className="nav-dot" aria-hidden="true" />
                <span>{page.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}

function BackgroundWorkspace({ onOpen }: { onOpen: () => void }) {
  const records = [
    ['GC-2026-0824', '滨江商务中心建设工程', '结算审定', '进行中'],
    ['GC-2026-0789', '东港产业园配套工程', '送审', '待处理'],
    ['GC-2026-0712', '市民服务中心改造工程', '归档', '已完成'],
    ['GC-2026-0651', '轨道交通站点综合开发', '施工费审定', '进行中'],
  ]

  return (
    <div className="background-workspace">
      <aside className="app-rail">
        <div className="app-mark"><Building2 size={20} /></div>
        <button type="button" className="rail-button is-active" title="工作台"><LayoutDashboard size={18} /></button>
        <button type="button" className="rail-button" title="项目"><FolderKanban size={18} /></button>
        <button type="button" className="rail-button" title="业务表单"><ClipboardList size={18} /></button>
      </aside>
      <main className="workspace-main">
        <header className="workspace-header">
          <div>
            <strong>工程项目管理</strong>
            <span>业务工作台</span>
          </div>
          <button type="button" className="open-entry-button" onClick={onOpen}>
            <FileCheck2 size={16} />
            录入审定信息
          </button>
        </header>
        <section className="workspace-content">
          <div className="workspace-title-row">
            <div>
              <h1>项目业务</h1>
              <p>工程业务处理记录</p>
            </div>
            <div className="workspace-search">
              <Search size={16} />
              <input aria-label="搜索项目" placeholder="搜索项目名称或编号" />
            </div>
          </div>
          <div className="project-table">
            <div className="project-row table-heading">
              <span>业务编号</span><span>项目名称</span><span>当前阶段</span><span>状态</span>
            </div>
            {records.map((record) => (
              <button type="button" className="project-row" key={record[0]} onClick={onOpen}>
                <span>{record[0]}</span><strong>{record[1]}</strong><span>{record[2]}</span><span>{record[3]}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [activePageId, setActivePageId] = useState('overall-review')
  const [reviewExpanded, setReviewExpanded] = useState(true)
  const [values, setValues] = useState(initialValues)
  const [savedValues, setSavedValues] = useState(initialValues)
  const [toast, setToast] = useState<Toast>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const formScrollRef = useRef<HTMLDivElement>(null)
  const reviewSectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const pendingScrollRef = useRef<string | null>(null)
  const scrollSpyLockRef = useRef<string | null>(null)
  const scrollUnlockTimerRef = useRef<number | null>(null)

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [activePageId],
  )
  const isReviewMode = activePage.group === 'review'

  useEffect(() => {
    if (activePage.group === 'review') setReviewExpanded(true)
  }, [activePage.group])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const targetId = pendingScrollRef.current
    if (!isReviewMode || !targetId) return

    const frame = window.requestAnimationFrame(() => {
      pendingScrollRef.current = null
      reviewSectionRefs.current[targetId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      if (scrollUnlockTimerRef.current) {
        window.clearTimeout(scrollUnlockTimerRef.current)
      }
      scrollUnlockTimerRef.current = window.setTimeout(() => {
        scrollSpyLockRef.current = null
        scrollUnlockTimerRef.current = null
      }, 1000)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activePageId, isReviewMode])

  useEffect(() => {
    const scrollArea = formScrollRef.current
    if (!isReviewMode || !scrollArea) return

    const updateActiveSection = () => {
      if (pendingScrollRef.current || scrollSpyLockRef.current) return

      const scrollTop = scrollArea.getBoundingClientRect().top
      let currentId = reviewPages[0].id

      reviewPages.forEach((page) => {
        const section = reviewSectionRefs.current[page.id]
        if (section && section.getBoundingClientRect().top - scrollTop <= 96) {
          currentId = page.id
        }
      })

      const isAtBottom =
        scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 24
      if (isAtBottom) currentId = reviewPages[reviewPages.length - 1].id

      setActivePageId((current) => (current === currentId ? current : currentId))
    }

    updateActiveSection()
    scrollArea.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      scrollArea.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [isReviewMode])

  useEffect(() => () => {
    if (scrollUnlockTimerRef.current) {
      window.clearTimeout(scrollUnlockTimerRef.current)
    }
  }, [])

  const updateValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }))
  }

  const resetCurrentPage = () => {
    const currentPages = isReviewMode ? reviewPages : [activePage]
    const currentFields = currentPages.flatMap(
      (page) => page.fields ?? page.contracts?.flatMap((item) => item.fields) ?? [],
    )
    setValues((current) => {
      const next = { ...current }
      currentFields.forEach((field) => {
        next[field.id] = savedValues[field.id]
      })
      return next
    })
  }

  const saveCurrentPage = () => {
    setSavedValues(values)
    setToast({ message: `${isReviewMode ? '审定信息' : activePage.label}已保存`, key: Date.now() })
  }

  const changePage = (pageId: string) => {
    const targetPage = pages.find((page) => page.id === pageId)
    if (!targetPage) return

    if (targetPage.group === 'review') {
      setReviewExpanded(true)
      pendingScrollRef.current = pageId
      scrollSpyLockRef.current = pageId
    } else {
      pendingScrollRef.current = null
      scrollSpyLockRef.current = null
      if (scrollUnlockTimerRef.current) {
        window.clearTimeout(scrollUnlockTimerRef.current)
        scrollUnlockTimerRef.current = null
      }
      window.requestAnimationFrame(() => formScrollRef.current?.scrollTo({ top: 0 }))
    }

    setActivePageId(pageId)
    setMobileNavOpen(false)
  }

  return (
    <div className="app-shell">
      <BackgroundWorkspace onOpen={() => setDrawerOpen(true)} />

      {drawerOpen && (
        <div className="entry-layer" role="dialog" aria-modal="true" aria-labelledby="entry-title">
          <button
            type="button"
            className="scrim"
            aria-label="关闭录入审定信息"
            onClick={() => setDrawerOpen(false)}
          />
          <section className="entry-panel">
            <header className="entry-header">
              <button
                type="button"
                className="mobile-menu-button"
                title="业务导航"
                aria-label="打开业务导航"
                onClick={() => setMobileNavOpen((open) => !open)}
              >
                <Menu size={18} />
              </button>
              <h2 id="entry-title">录入审定信息</h2>
              <button
                type="button"
                className="icon-button close-button"
                title="关闭"
                aria-label="关闭"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="entry-body">
              <div className={mobileNavOpen ? 'mobile-nav-backdrop is-open' : 'mobile-nav-backdrop'} onClick={() => setMobileNavOpen(false)} />
              <div className={mobileNavOpen ? 'sidebar-wrap is-open' : 'sidebar-wrap'}>
                <Sidebar
                  activePage={activePage}
                  expanded={reviewExpanded}
                  onExpandedChange={setReviewExpanded}
                  onPageChange={changePage}
                />
              </div>

              <main className="form-workspace">
                <div className="form-scroll-area" ref={formScrollRef}>
                  <div className="page-heading">
                    <div className="breadcrumb">
                      录入审定信息 / {isReviewMode ? '审定信息' : '送审信息'}
                    </div>
                    <h1>{isReviewMode ? '审定信息' : activePage.label}</h1>
                  </div>

                  {isReviewMode ? (
                    <div className="review-sections">
                      {reviewPages.map((page) => (
                        <section
                          className="review-section"
                          id={page.id}
                          key={page.id}
                          ref={(node) => {
                            reviewSectionRefs.current[page.id] = node
                          }}
                        >
                          <div className="review-section-heading">
                            <span aria-hidden="true" />
                            <h2>{page.label}</h2>
                          </div>

                          {page.contracts ? (
                            <div className="contracts">
                              {page.contracts.map((contract, index) => (
                                <div className="contract-group" key={contract.id}>
                                  {index > 0 && <div className="contract-divider" aria-hidden="true" />}
                                  <section className="contract-section">
                                    <div className="contract-heading">
                                      <span className="contract-icon" aria-hidden="true">
                                        <FileText size={16} />
                                      </span>
                                      <h3>{contract.label}</h3>
                                    </div>
                                    <FieldGrid
                                      fields={contract.fields}
                                      values={values}
                                      onChange={updateValue}
                                    />
                                  </section>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <FieldGrid
                              fields={page.fields ?? []}
                              values={values}
                              onChange={updateValue}
                            />
                          )}
                        </section>
                      ))}
                    </div>
                  ) : (
                    <FieldGrid fields={activePage.fields ?? []} values={values} onChange={updateValue} />
                  )}
                </div>

                <footer className="form-footer">
                  <button type="button" className="secondary-button" onClick={resetCurrentPage}>
                    <X size={15} />
                    取消
                  </button>
                  <button type="button" className="primary-button" onClick={saveCurrentPage}>
                    <Save size={15} />
                    保存
                  </button>
                </footer>
              </main>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast" role="status" key={toast.key}>
          <span className="toast-icon"><Check size={15} /></span>
          {toast.message}
        </div>
      )}
    </div>
  )
}
