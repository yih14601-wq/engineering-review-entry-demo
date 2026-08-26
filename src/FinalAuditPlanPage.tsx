import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import {
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  Building2,
  Calculator,
  Camera,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileCheck2,
  FileSignature,
  FileText,
  GitBranch,
  HardHat,
  Image,
  Landmark,
  Map,
  MapPinned,
  Menu,
  MonitorCog,
  Paperclip,
  ReceiptText,
  Recycle,
  Ruler,
  Save,
  Send,
  Stamp,
  X,
} from 'lucide-react'
import {
  entryReviewSections,
  type EntrySectionDefinition,
  type FieldDefinition,
} from './data'
import { FieldGrid } from './FormField'
import { useAnchorNavigation } from './useAnchorNavigation'

interface PreviewAttachment {
  name: string
  meta: string
}

interface PreviewSection {
  id: string
  label: string
  icon: ComponentType<{ size?: number }>
  fields: FieldDefinition[]
}

const previewField = (id: string, label: string, value: string): FieldDefinition => ({
  id,
  label,
  value,
  kind: 'readonly',
})

const readonlyFields = (fields: FieldDefinition[]) =>
  fields.map((field) => ({ ...field, kind: 'readonly' as const }))

const projectFields = [
  previewField('audit-project-name', '工程名称', '城市更新综合改造项目'),
  previewField('audit-project-number', '工程编号', 'GC-2026-0825'),
  previewField('audit-project-type', '工程类型', '城市更新工程'),
  previewField('audit-project-owner', '建设单位', '城市更新建设有限公司'),
  previewField('audit-project-address', '工程地址', '上海市浦东新区示范路 88 号'),
]

const contractSections: PreviewSection[] = [
  {
    id: 'audit-final-construction-contract',
    label: '施工合同',
    icon: HardHat,
    fields: [
      previewField('construction-contract-name', '合同名称', '施工总承包合同'),
      previewField('construction-contract-number', '合同编号', 'SG-2026-001'),
      previewField('construction-contract-date', '签订日期', '2026-02-18'),
      previewField('construction-contract-amount', '合同金额（元）', '12,800,000.00'),
    ],
  },
  {
    id: 'audit-final-design-contract',
    label: '设计合同',
    icon: Ruler,
    fields: [
      previewField('design-contract-name', '合同名称', '工程设计服务合同'),
      previewField('design-contract-number', '合同编号', 'SJ-2026-004'),
      previewField('design-contract-date', '签订日期', '2026-01-22'),
      previewField('design-contract-amount', '合同金额（元）', '1,200,000.00'),
    ],
  },
  {
    id: 'audit-final-supervision-contract',
    label: '监理合同',
    icon: ClipboardCheck,
    fields: [
      previewField('supervision-contract-name', '合同名称', '全过程监理合同'),
      previewField('supervision-contract-number', '合同编号', 'JL-2026-002'),
      previewField('supervision-contract-date', '签订日期', '2026-02-05'),
      previewField('supervision-contract-amount', '合同金额（元）', '960,000.00'),
    ],
  },
]

const submissionFields = [
  previewField('audit-submission-company', '送审单位', '城市更新建设有限公司'),
  previewField('audit-submission-date', '送审日期', '2026-08-25'),
  previewField('audit-submission-contact', '送审联系人', '王建华'),
  previewField('audit-submission-phone', '联系电话', '138 0000 8625'),
  previewField('audit-submission-amount', '送审金额（元）', '12,580,000.00'),
  previewField('audit-submission-count', '送审资料份数', '12 份'),
  previewField('audit-submission-owner', '项目负责人', '陈晓峰'),
  previewField('audit-submission-type', '送审类型', '竣工结算送审'),
  previewField('audit-submission-batch', '送审批次', '第 1 批'),
  previewField('audit-submission-deadline', '计划完成日期', '2026-09-30'),
  previewField('audit-submission-note', '送审说明', '城市更新综合改造工程竣工结算'),
  previewField('audit-submission-department', '接收部门', '工程审计部'),
]

const recordFields = [
  previewField('audit-record-number', '记录编号', 'SJJL-2026-018'),
  previewField('audit-record-user', '审计人员', '李明远'),
  previewField('audit-record-date', '记录日期', '2026-09-06'),
  previewField('audit-record-type', '记录类型', '现场核验记录'),
  previewField('audit-record-result', '记录结论', '资料完整，金额待复核'),
]

const workingPaperFields = [
  previewField('audit-paper-number', '底稿编号', 'SJDG-2026-012'),
  previewField('audit-paper-author', '编制人员', '李明远'),
  previewField('audit-paper-reviewer', '复核人员', '周海宁'),
  previewField('audit-paper-date', '编制日期', '2026-09-08'),
  previewField('audit-paper-status', '底稿状态', '已复核'),
]

const locationFields = [
  previewField('audit-location-name', '点位名称', '综合改造项目主入口'),
  previewField('audit-location-number', '点位编号', 'DW-2026-01'),
  previewField('audit-location-time', '定位时间', '2026-09-03 10:26'),
  previewField('audit-location-owner', '现场负责人', '张建国'),
  previewField('audit-location-note', '点位说明', '施工范围与竣工图一致'),
]

const decisionContracts: PreviewSection[] = [
  {
    id: 'audit-final-decision-contract-1',
    label: '施工合同 1',
    icon: HardHat,
    fields: [
      previewField('decision-contract-1-name', '合同名称', '施工总承包合同 1'),
      previewField('decision-contract-1-number', '合同编号', 'SG-2026-001'),
      previewField('decision-contract-1-submitted', '送审金额（元）', '6,420,000.00'),
      previewField('decision-contract-1-reviewed', '审定金额（元）', '6,080,000.00'),
      previewField('decision-contract-1-final', '定案金额（元）', '6,060,000.00'),
    ],
  },
  {
    id: 'audit-final-decision-contract-2',
    label: '施工合同 2',
    icon: HardHat,
    fields: [
      previewField('decision-contract-2-name', '合同名称', '施工总承包合同 2'),
      previewField('decision-contract-2-number', '合同编号', 'SG-2026-002'),
      previewField('decision-contract-2-submitted', '送审金额（元）', '3,860,000.00'),
      previewField('decision-contract-2-reviewed', '审定金额（元）', '3,690,000.00'),
      previewField('decision-contract-2-final', '定案金额（元）', '3,675,000.00'),
    ],
  },
]

const submissionAttachments: PreviewAttachment[] = [
  { name: '送审资料清单.pdf', meta: 'PDF · 2.8 MB · 2026-08-25' },
  { name: '工程量清单.xlsx', meta: 'XLSX · 4.6 MB · 2026-08-25' },
  { name: '合同汇总.pdf', meta: 'PDF · 6.2 MB · 2026-08-24' },
  { name: '竣工图纸.zip', meta: 'ZIP · 18.4 MB · 2026-08-24' },
]

const reviewAttachments: PreviewAttachment[] = [
  { name: '审定汇总表.pdf', meta: 'PDF · 3.1 MB · 2026-08-25' },
  { name: '审定计算书.xlsx', meta: 'XLSX · 5.4 MB · 2026-08-25' },
  { name: '复核意见.pdf', meta: 'PDF · 1.2 MB · 2026-08-24' },
  { name: '审定签章页.jpg', meta: 'JPG · 2.6 MB · 2026-08-24' },
]

const recordAttachments: PreviewAttachment[] = [
  { name: '现场核验记录.pdf', meta: 'PDF · 3.8 MB · 2026-08-25' },
  { name: '审计沟通记录.docx', meta: 'DOCX · 1.6 MB · 2026-08-25' },
  { name: '问题整改回复.pdf', meta: 'PDF · 2.3 MB · 2026-08-24' },
  { name: '会议纪要.pdf', meta: 'PDF · 1.9 MB · 2026-08-24' },
]

const paperAttachments: PreviewAttachment[] = [
  { name: '工程审计底稿.pdf', meta: 'PDF · 7.8 MB · 2026-08-25' },
  { name: '取证单.pdf', meta: 'PDF · 2.1 MB · 2026-08-25' },
  { name: '复核记录.docx', meta: 'DOCX · 1.4 MB · 2026-08-24' },
  { name: '底稿签字页.jpg', meta: 'JPG · 2.9 MB · 2026-08-24' },
]

const reportAttachments: PreviewAttachment[] = [
  { name: '工程审计报告.pdf', meta: 'PDF · 8.6 MB · 2026-08-25' },
  { name: '报告附件.pdf', meta: 'PDF · 4.2 MB · 2026-08-25' },
  { name: '审计结论确认单.pdf', meta: 'PDF · 2.4 MB · 2026-08-24' },
  { name: '报告签章页.jpg', meta: 'JPG · 3.0 MB · 2026-08-24' },
]

const reviewSectionIcons: Record<EntrySectionDefinition['icon'], ComponentType<{ size?: number }>> = {
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

const decisionTypes = ['结算定案', '施工合同', '设计合同', '监理合同', '其他费用']

const auditAnchorIds = [
  'audit-final-project',
  'audit-final-contracts',
  ...contractSections.map((section) => section.id),
  'audit-final-submission',
  'audit-final-review',
  ...entryReviewSections.map((section) => `audit-final-review-${section.id}`),
  'audit-final-review-attachments',
  'audit-final-records',
  'audit-final-record-attachments',
  'audit-final-working-papers',
  'audit-final-paper-attachments',
  'audit-final-location',
  'audit-final-photos',
  'audit-final-map',
  'audit-final-report',
  'audit-final-decision',
  ...decisionContracts.map((section) => section.id),
  'audit-final-decision-scan',
]

interface DirectoryGroup {
  id: string
  label: string
  icon: ComponentType<{ size?: number }>
  children?: Array<{ id: string; label: string }>
}

const directoryGroups: DirectoryGroup[] = [
  { id: 'audit-final-project', label: '工程信息', icon: Building2 },
  {
    id: 'audit-final-contracts',
    label: '合同信息',
    icon: FileSignature,
    children: contractSections.map(({ id, label }) => ({ id, label })),
  },
  { id: 'audit-final-submission', label: '送审信息', icon: Send },
  {
    id: 'audit-final-review',
    label: '审定信息',
    icon: BadgeCheck,
    children: [
      ...entryReviewSections.map((section) => ({
        id: `audit-final-review-${section.id}`,
        label: section.label,
      })),
      { id: 'audit-final-review-attachments', label: '审定附件' },
    ],
  },
  {
    id: 'audit-final-records',
    label: '审计记录',
    icon: ClipboardList,
    children: [{ id: 'audit-final-record-attachments', label: '审定记录附件' }],
  },
  {
    id: 'audit-final-working-papers',
    label: '审计底稿',
    icon: BookOpenCheck,
    children: [{ id: 'audit-final-paper-attachments', label: '审定底稿附件' }],
  },
  {
    id: 'audit-final-location',
    label: '点位信息',
    icon: MapPinned,
    children: [
      { id: 'audit-final-photos', label: '现场照片' },
      { id: 'audit-final-map', label: '现场定位地图' },
    ],
  },
  { id: 'audit-final-report', label: '审计报告', icon: FileText },
  {
    id: 'audit-final-decision',
    label: '定案单',
    icon: Stamp,
    children: [
      ...decisionContracts.map(({ id, label }) => ({ id, label })),
      { id: 'audit-final-decision-scan', label: '定案单扫描件' },
    ],
  },
]

function groupIsActive(group: DirectoryGroup, activeAnchor: string) {
  return group.id === activeAnchor || group.children?.some((item) => item.id === activeAnchor)
}

function AuditDirectory({
  activeAnchor,
  onNavigate,
}: {
  activeAnchor: string
  onNavigate: (id: string) => void
}) {
  const directoryRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const directory = directoryRef.current
      const activeItem = directory?.querySelector<HTMLElement>(
        `[data-anchor-id="${activeAnchor}"]`,
      )
      if (!directory || !activeItem) return

      const directoryRect = directory.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const visibleTop = directoryRect.top + 56
      const visibleBottom = directoryRect.bottom - 24
      let nextScrollTop = directory.scrollTop

      if (itemRect.top < visibleTop) {
        nextScrollTop += itemRect.top - visibleTop - 8
      } else if (itemRect.bottom > visibleBottom) {
        nextScrollTop += itemRect.bottom - visibleBottom + 8
      } else {
        return
      }

      directory.scrollTo({ top: Math.max(0, nextScrollTop), behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeAnchor])

  return (
    <aside className="audit-directory" aria-label="审计计划工单目录" ref={directoryRef}>
      <div className="directory-label">工单目录</div>
      <nav className="anchor-nav audit-anchor-nav final-audit-anchor-nav">
        {directoryGroups.map((group) => {
          const Icon = group.icon
          return (
            <div className="final-directory-group" key={group.id}>
              <button
                type="button"
                data-anchor-id={group.id}
                className={`anchor-primary${groupIsActive(group, activeAnchor) ? ' is-active' : ''}`}
                onClick={() => onNavigate(group.id)}
              >
                <Icon size={16} />
                <span>{group.label}</span>
              </button>
              {group.children && (
                <div className="anchor-secondary-group">
                  {group.children.map((item) => (
                    <button
                      type="button"
                      data-anchor-id={item.id}
                      key={item.id}
                      className={`anchor-secondary${activeAnchor === item.id ? ' is-active' : ''}`}
                      aria-current={activeAnchor === item.id ? 'location' : undefined}
                      onClick={() => onNavigate(item.id)}
                    >
                      <span className="nav-dot" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function PrimaryHeading({
  title,
  icon: Icon,
}: {
  title: string
  icon: ComponentType<{ size?: number }>
}) {
  return (
    <div className="primary-anchor-heading audit-final-primary-heading">
      <span className="primary-anchor-icon"><Icon size={18} /></span>
      <h2>{title}</h2>
    </div>
  )
}

function PreviewCard({
  title,
  icon: Icon,
  fields,
  sectionRef,
  children,
  className = '',
}: {
  title: string
  icon: ComponentType<{ size?: number }>
  fields?: FieldDefinition[]
  sectionRef?: (node: HTMLElement | null) => void
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={`audit-preview-card${className ? ` ${className}` : ''}`} ref={sectionRef}>
      <div className="audit-preview-heading">
        <span className="audit-preview-icon"><Icon size={18} /></span>
        <h3>{title}</h3>
      </div>
      {fields && <FieldGrid fields={fields} values={{}} onChange={() => undefined} />}
      {children}
    </section>
  )
}

function AttachmentGrid({
  title,
  files,
  embedded = false,
  onOpen,
}: {
  title?: string
  files: PreviewAttachment[]
  embedded?: boolean
  onOpen: (file: PreviewAttachment) => void
}) {
  return (
    <div className={embedded ? 'embedded-attachment-area' : undefined}>
      {embedded && title && (
        <div className="embedded-attachment-title">
          <Paperclip size={18} />
          <h4>{title}</h4>
        </div>
      )}
      <div className="preview-attachment-grid">
        {files.map((file) => (
          <button
            type="button"
            className="preview-attachment-item"
            key={file.name}
            onClick={() => onOpen(file)}
            aria-label={`查看附件 ${file.name}`}
          >
            <span className="preview-file-icon"><FileText size={18} /></span>
            <span className="preview-file-copy">
              <strong>{file.name}</strong>
              <small>{file.meta}</small>
            </span>
            <Eye size={18} className="preview-file-action" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

function AttachmentCard({
  title,
  files,
  sectionRef,
  onOpen,
}: {
  title: string
  files: PreviewAttachment[]
  sectionRef?: (node: HTMLElement | null) => void
  onOpen: (file: PreviewAttachment) => void
}) {
  return (
    <PreviewCard title={title} icon={Paperclip} sectionRef={sectionRef}>
      <AttachmentGrid files={files} onOpen={onOpen} />
    </PreviewCard>
  )
}

function AuditPrimaryBlock({
  title,
  icon,
  sectionRef,
  children,
}: {
  title: string
  icon: ComponentType<{ size?: number }>
  sectionRef: (node: HTMLElement | null) => void
  children: React.ReactNode
}) {
  return (
    <section className="audit-final-primary-block" ref={sectionRef}>
      <PrimaryHeading title={title} icon={icon} />
      {children}
    </section>
  )
}

function ScanPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="scan-preview-item" onClick={onOpen}>
      <span>点击图片可放大查看</span>
      <img src="./pencil-assets/xLnSs.png" alt="定案单扫描件缩略图" />
    </button>
  )
}

export default function FinalAuditPlanPage({
  onBackToSubmission,
  onOpenEntry,
  onNotify,
}: {
  onBackToSubmission: () => void
  onOpenEntry: () => void
  onNotify: (message: string, tone?: 'success' | 'error') => void
}) {
  const [decisionType, setDecisionType] = useState(decisionTypes[0])
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)
  const anchors = useMemo(() => auditAnchorIds, [])
  const { activeAnchor, registerSection, scrollRef, scrollToAnchor } =
    useAnchorNavigation(anchors, 'audit-final-project')

  const navigate = (id: string) => {
    scrollToAnchor(id)
    setDirectoryOpen(false)
  }

  const openAttachment = (file: PreviewAttachment) => {
    onNotify(`正在预览“${file.name}”`)
  }

  return (
    <div className="system-shell final-audit-page">
      <header className="system-header">
        <div className="system-header-start">
          <h1>审计计划</h1>
          <button type="button" className="secondary-button compact-button" onClick={onBackToSubmission}>
            <Send size={16} />
            送审管理
          </button>
          <button type="button" className="primary-button compact-button" onClick={onOpenEntry}>
            <FileCheck2 size={16} />
            录入审定信息
          </button>
        </div>
      </header>

      <div className="system-body">
        <aside className="system-sidebar" aria-label="左侧占位区域" />

        <main className="audit-work-card">
          <button
            type="button"
            className="icon-button audit-directory-toggle"
            title="工单目录"
            aria-label="打开工单目录"
            onClick={() => setDirectoryOpen((current) => !current)}
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            className={`mobile-nav-backdrop${directoryOpen ? ' is-open' : ''}`}
            aria-label="关闭工单目录"
            onClick={() => setDirectoryOpen(false)}
          />
          <div className={`audit-directory-wrap${directoryOpen ? ' is-open' : ''}`}>
            <AuditDirectory activeAnchor={activeAnchor} onNavigate={navigate} />
          </div>

          <div className="audit-main-column">
            <div className="audit-content-scroll" ref={scrollRef}>
              <header className="audit-detail-header">
                <div>
                  <h2>工程详情</h2>
                  <span>当前项目：1</span>
                </div>
                <button type="button" className="secondary-button compact-button audit-node-button">
                  <GitBranch size={16} />
                  当前流程节点
                </button>
              </header>

              <div className="audit-content-stack final-audit-content-stack">
                <AuditPrimaryBlock
                  title="工程信息"
                  icon={Building2}
                  sectionRef={registerSection('audit-final-project')}
                >
                  <PreviewCard title="工程信息" icon={Building2} fields={projectFields} />
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="合同信息"
                  icon={FileSignature}
                  sectionRef={registerSection('audit-final-contracts')}
                >
                  {contractSections.map((section) => (
                    <PreviewCard
                      key={section.id}
                      title={section.label}
                      icon={section.icon}
                      fields={section.fields}
                      sectionRef={registerSection(section.id)}
                    />
                  ))}
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="送审信息"
                  icon={Send}
                  sectionRef={registerSection('audit-final-submission')}
                >
                  <PreviewCard title="送审信息" icon={Send} fields={submissionFields}>
                    <AttachmentGrid
                      embedded
                      title="送审附件"
                      files={submissionAttachments}
                      onOpen={openAttachment}
                    />
                  </PreviewCard>
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="审定信息"
                  icon={BadgeCheck}
                  sectionRef={registerSection('audit-final-review')}
                >
                  {entryReviewSections.map((section) => {
                    const Icon = reviewSectionIcons[section.icon]
                    if (section.contracts) {
                      return (
                        <PreviewCard
                          key={section.id}
                          title={section.label}
                          icon={Icon}
                          sectionRef={registerSection(`audit-final-review-${section.id}`)}
                          className="audit-review-contract-card"
                        >
                          <div className="audit-preview-contract-list">
                            {section.contracts.map((contract, index) => (
                              <div className="audit-preview-contract-wrap" key={contract.id}>
                                {index > 0 && <div className="repeated-group-divider" aria-hidden="true" />}
                                <section className="entry-contract-card">
                                  <div className="tertiary-heading">
                                    <span className="tertiary-icon"><FileSignature size={16} /></span>
                                    <h4>{contract.label}</h4>
                                  </div>
                                  <FieldGrid
                                    contract
                                    fields={readonlyFields(contract.fields)}
                                    values={{}}
                                    onChange={() => undefined}
                                  />
                                </section>
                              </div>
                            ))}
                          </div>
                        </PreviewCard>
                      )
                    }
                    return (
                      <PreviewCard
                        key={section.id}
                        title={section.label}
                        icon={Icon}
                        fields={readonlyFields(section.fields ?? [])}
                        sectionRef={registerSection(`audit-final-review-${section.id}`)}
                      />
                    )
                  })}
                  <AttachmentCard
                    title="审定附件"
                    files={reviewAttachments}
                    sectionRef={registerSection('audit-final-review-attachments')}
                    onOpen={openAttachment}
                  />
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="审计记录"
                  icon={ClipboardList}
                  sectionRef={registerSection('audit-final-records')}
                >
                  <PreviewCard title="审计记录" icon={ClipboardList} fields={recordFields} />
                  <AttachmentCard
                    title="审定记录附件"
                    files={recordAttachments}
                    sectionRef={registerSection('audit-final-record-attachments')}
                    onOpen={openAttachment}
                  />
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="审计底稿"
                  icon={BookOpenCheck}
                  sectionRef={registerSection('audit-final-working-papers')}
                >
                  <PreviewCard title="审计底稿" icon={BookOpenCheck} fields={workingPaperFields} />
                  <AttachmentCard
                    title="审定底稿附件"
                    files={paperAttachments}
                    sectionRef={registerSection('audit-final-paper-attachments')}
                    onOpen={openAttachment}
                  />
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="点位信息"
                  icon={MapPinned}
                  sectionRef={registerSection('audit-final-location')}
                >
                  <PreviewCard title="点位信息" icon={MapPinned} fields={locationFields} />
                  <PreviewCard
                    title="现场照片"
                    icon={Camera}
                    sectionRef={registerSection('audit-final-photos')}
                  >
                    <div className="audit-photo-list">
                      {['自拍照片', '设备照片'].map((label) => (
                        <div className="audit-photo-item" key={label}>
                          <span>{label}</span>
                          <img src="./pencil-assets/xLnSs.png" alt={`${label}预览`} />
                        </div>
                      ))}
                    </div>
                  </PreviewCard>
                  <PreviewCard
                    title="现场定位地图"
                    icon={Map}
                    sectionRef={registerSection('audit-final-map')}
                  >
                    <div className="audit-map-preview">
                      <img src="./pencil-assets/Gie4P.png" alt="城市更新综合改造项目现场地图点位" />
                    </div>
                  </PreviewCard>
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="审计报告"
                  icon={FileText}
                  sectionRef={registerSection('audit-final-report')}
                >
                  <AttachmentCard title="审计报告" files={reportAttachments} onOpen={openAttachment} />
                </AuditPrimaryBlock>

                <AuditPrimaryBlock
                  title="定案单"
                  icon={Stamp}
                  sectionRef={registerSection('audit-final-decision')}
                >
                  <PreviewCard title="定案单类型" icon={ClipboardCheck}>
                    <div className="decision-type-tabs" role="tablist" aria-label="定案单类型">
                      {decisionTypes.map((type) => (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={decisionType === type}
                          className={decisionType === type ? 'is-active' : undefined}
                          key={type}
                          onClick={() => setDecisionType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </PreviewCard>
                  {decisionContracts.map((section) => (
                    <PreviewCard
                      key={section.id}
                      title={section.label}
                      icon={section.icon}
                      fields={section.fields}
                      sectionRef={registerSection(section.id)}
                    />
                  ))}
                  <PreviewCard
                    title="定案单扫描件"
                    icon={Image}
                    sectionRef={registerSection('audit-final-decision-scan')}
                  >
                    <ScanPreview onOpen={() => setScanOpen(true)} />
                  </PreviewCard>
                </AuditPrimaryBlock>

                <div className="scroll-end-space" aria-hidden="true" />
              </div>
            </div>

            <footer className="send-management-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onNotify('审计计划已保存，尚未提交')}
              >
                <Save size={16} />
                不提交，仅保存
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => onNotify('审计计划已保存并提交')}
              >
                <Send size={16} />
                保存并提交
              </button>
            </footer>
          </div>
        </main>
      </div>

      {scanOpen && (
        <div className="scan-modal-layer" role="dialog" aria-modal="true" aria-labelledby="scan-modal-title">
          <button type="button" className="scan-modal-scrim" aria-label="关闭扫描件预览" onClick={() => setScanOpen(false)} />
          <section className="scan-modal">
            <header>
              <div>
                <Image size={18} />
                <h2 id="scan-modal-title">定案单扫描件</h2>
              </div>
              <button type="button" className="icon-button" title="关闭" aria-label="关闭" onClick={() => setScanOpen(false)}>
                <X size={18} />
              </button>
            </header>
            <div className="scan-modal-content">
              <img src="./pencil-assets/xLnSs.png" alt="放大的定案单扫描件" />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
