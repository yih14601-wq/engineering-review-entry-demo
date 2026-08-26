import { useMemo, useRef, useState, type ComponentType } from 'react'
import {
  Boxes,
  ClipboardCheck,
  Database,
  FileCheck2,
  FilePlus2,
  Files,
  FolderKanban,
  HardHat,
  LockKeyhole,
  Menu,
  Paperclip,
  Plus,
  ReceiptText,
  Ruler,
  Save,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import {
  createPlanGroup,
  initialPlanGroups,
  otherInformationFields,
  planGroupConfigs,
  planInitialValues,
  projectFields,
  suppliedMaterialFields,
  uploadCategories,
  type FieldDefinition,
  type PlanGroup,
  type PlanGroupCategory,
  type UploadCategory,
  type UploadCategoryId,
} from './data'
import { FieldGrid } from './FormField'
import FileUploadPanel, {
  MAX_UPLOAD_FILE_SIZE,
  type UploadFileItem,
} from './FileUploadPanel'
import { useAnchorNavigation } from './useAnchorNavigation'

const auditAnchorIds = [
  'audit-project',
  'audit-send-plan',
  'audit-construction',
  'audit-design',
  'audit-supervision',
  'audit-supplied-material',
  'audit-other',
  'audit-attachments',
  ...uploadCategories.map((category) => `audit-${category.id}`),
]

const groupIcons: Record<PlanGroupCategory, ComponentType<{ size?: number }>> = {
  construction: HardHat,
  design: Ruler,
  supervision: ClipboardCheck,
}

const uploadIcons: Record<UploadCategory['icon'], ComponentType<{ size?: number }>> = {
  'file-plus': FilePlus2,
  'file-check': FileCheck2,
  files: Files,
}

const emptyUploads = uploadCategories.reduce(
  (result, category) => {
    result[category.id] = []
    return result
  },
  {} as Record<UploadCategoryId, UploadFileItem[]>,
)

function PrimaryAnchorHeading({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ size?: number }>
  title: string
}) {
  return (
    <div className="primary-anchor-heading audit-primary-anchor">
      <span className="primary-anchor-icon"><Icon size={18} /></span>
      <h2>{title}</h2>
    </div>
  )
}

function AuditDirectory({
  activeAnchor,
  onNavigate,
}: {
  activeAnchor: string
  onNavigate: (id: string) => void
}) {
  const sendPlanActive = [
    'audit-send-plan',
    'audit-construction',
    'audit-design',
    'audit-supervision',
    'audit-supplied-material',
    'audit-other',
  ].includes(activeAnchor)
  const attachmentsActive = activeAnchor === 'audit-attachments' || activeAnchor.includes('-files')

  return (
    <aside className="audit-directory" aria-label="送审管理工单目录">
      <div className="directory-label">工单目录</div>
      <nav className="anchor-nav audit-anchor-nav">
        <button
          type="button"
          className={`anchor-primary${activeAnchor === 'audit-project' ? ' is-active' : ''}`}
          onClick={() => onNavigate('audit-project')}
        >
          <FolderKanban size={16} />
          <span>项目资料</span>
        </button>

        <button
          type="button"
          className={`anchor-primary${sendPlanActive ? ' is-active' : ''}`}
          onClick={() => onNavigate('audit-send-plan')}
        >
          <Send size={16} />
          <span>送审计划</span>
        </button>
        <div className="anchor-secondary-group">
          {([
            ['audit-construction', '施工'],
            ['audit-design', '设计'],
            ['audit-supervision', '监理'],
            ['audit-supplied-material', '甲供物资'],
            ['audit-other', '其他信息'],
          ] as const).map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={`anchor-secondary${activeAnchor === id ? ' is-active' : ''}`}
              aria-current={activeAnchor === id ? 'location' : undefined}
              onClick={() => onNavigate(id)}
            >
              <span className="nav-dot" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`anchor-primary anchor-group-start${attachmentsActive ? ' is-active' : ''}`}
          onClick={() => onNavigate('audit-attachments')}
        >
          <Paperclip size={16} />
          <span>附件上传列表</span>
        </button>
        <div className="anchor-secondary-group">
          {uploadCategories.map((category) => {
            const id = `audit-${category.id}`
            return (
              <button
                type="button"
                key={category.id}
                className={`anchor-secondary${activeAnchor === id ? ' is-active' : ''}`}
                aria-current={activeAnchor === id ? 'location' : undefined}
                onClick={() => onNavigate(id)}
              >
                <span className="nav-dot" aria-hidden="true" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

function SupplierModal({
  category,
  onClose,
  onSubmit,
}: {
  category: PlanGroupCategory
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState('')
  const [hasError, setHasError] = useState(false)
  const config = planGroupConfigs[category]

  const submit = () => {
    if (!name.trim()) {
      setHasError(true)
      return
    }
    onSubmit(name.trim())
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="supplier-title">
      <button type="button" className="modal-scrim" aria-label="关闭新增供应商弹窗" onClick={onClose} />
      <section className="supplier-modal">
        <header className="modal-header">
          <div>
            <span className="modal-title-icon"><Database size={18} /></span>
            <h2 id="supplier-title">新增供应商</h2>
          </div>
          <button type="button" className="icon-button" title="关闭" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">
          <label htmlFor="supplier-name">{config.label}供应商名称</label>
          <input
            id="supplier-name"
            autoFocus
            value={name}
            aria-invalid={hasError}
            placeholder="请输入供应商名称"
            onChange={(event) => {
              setName(event.target.value)
              setHasError(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit()
            }}
          />
          {hasError && <p className="field-error">请输入供应商名称</p>}
          <p className="modal-helper">提交后写入供应商数据库，不在当前页面新增字段。</p>
        </div>
        <footer className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>取消</button>
          <button type="button" className="primary-button" onClick={submit}>确认新增</button>
        </footer>
      </section>
    </div>
  )
}

function GroupSection({
  category,
  groups,
  onAdd,
  onDelete,
  onOpenSupplier,
  onFieldChange,
  sectionRef,
}: {
  category: PlanGroupCategory
  groups: PlanGroup[]
  onAdd: () => void
  onDelete: (groupId: string) => void
  onOpenSupplier: () => void
  onFieldChange: (groupId: string, fieldId: string, value: string) => void
  sectionRef: (node: HTMLElement | null) => void
}) {
  const config = planGroupConfigs[category]
  const Icon = groupIcons[category]
  const canDelete = groups.length > config.minimumGroups

  return (
    <section className="audit-section-card grouped-section" ref={sectionRef}>
      <div className="audit-section-heading with-actions">
        <div className="audit-section-title">
          <span className="audit-section-icon"><Icon size={20} /></span>
          <h3>{config.label}</h3>
        </div>
        <div className="section-actions">
          <button type="button" className="secondary-button compact-button" onClick={onOpenSupplier}>
            <Database size={16} />
            新增供应商
          </button>
          <button type="button" className="primary-button compact-button" onClick={onAdd}>
            <Plus size={16} />
            新增组
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="empty-group-state">
          <span><Files size={20} /></span>
          <strong>暂无{config.label}信息</strong>
          <p>新增一组后即可录入送审计划数据</p>
          <button type="button" className="primary-button compact-button" onClick={onAdd}>
            <Plus size={16} />
            新增组
          </button>
        </div>
      ) : (
        <div className="plan-group-list">
          {groups.map((group, index) => (
            <div className="plan-group-wrap" key={group.id}>
              {index > 0 && <div className="repeated-group-divider" aria-hidden="true" />}
              <section className="plan-group-card">
                <div className="tertiary-heading group-card-heading">
                  <div>
                    <span className="tertiary-icon"><Files size={16} /></span>
                    <h4>{config.label}组 {index + 1}</h4>
                  </div>
                  <button
                    type="button"
                    className="delete-group-button"
                    disabled={!canDelete}
                    title={!canDelete ? '施工至少保留一组' : '删除本组'}
                    aria-label={!canDelete ? '施工至少保留一组，当前不可删除' : `删除${config.label}组 ${index + 1}`}
                    onClick={() => onDelete(group.id)}
                  >
                    {!canDelete ? <LockKeyhole size={15} /> : <Trash2 size={15} />}
                    <span>删除本组</span>
                  </button>
                </div>
                <FieldGrid
                  fields={group.fields}
                  values={group.fields.reduce<Record<string, string>>((values, item) => {
                    values[item.id] = item.value
                    return values
                  }, {})}
                  onChange={(fieldId, value) => onFieldChange(group.id, fieldId, value)}
                />
              </section>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function DirectPlanSection({
  title,
  icon: Icon,
  fields,
  values,
  onChange,
  sectionRef,
}: {
  title: string
  icon: ComponentType<{ size?: number }>
  fields: FieldDefinition[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
  sectionRef: (node: HTMLElement | null) => void
}) {
  return (
    <section className="audit-section-card" ref={sectionRef}>
      <div className="audit-section-heading">
        <div className="audit-section-title">
          <span className="audit-section-icon"><Icon size={20} /></span>
          <h3>{title}</h3>
        </div>
      </div>
      <FieldGrid fields={fields} values={values} onChange={onChange} />
    </section>
  )
}

function UploadSection({
  category,
  files,
  onFiles,
  onDelete,
  onRetry,
  sectionRef,
}: {
  category: UploadCategory
  files: UploadFileItem[]
  onFiles: (files: File[]) => void
  onDelete: (id: string) => void
  onRetry: (id: string) => void
  sectionRef: (node: HTMLElement | null) => void
}) {
  const Icon = uploadIcons[category.icon]

  return (
    <section className="audit-section-card upload-section" ref={sectionRef}>
      <div className="audit-section-heading">
        <div className="audit-section-title">
          <span className="audit-section-icon"><Icon size={20} /></span>
          <h3>{category.label}</h3>
        </div>
      </div>
      <FileUploadPanel
        categoryLabel={category.label}
        files={files}
        onFiles={onFiles}
        onDelete={onDelete}
        onRetry={onRetry}
      />
    </section>
  )
}

export default function AuditPlanPage({
  onOpenAudit,
  onOpenEntry,
  onNotify,
}: {
  onOpenAudit: () => void
  onOpenEntry: () => void
  onNotify: (message: string, tone?: 'success' | 'error') => void
}) {
  const [values, setValues] = useState(planInitialValues)
  const [groups, setGroups] = useState(initialPlanGroups)
  const [uploads, setUploads] = useState(emptyUploads)
  const [supplierCategory, setSupplierCategory] = useState<PlanGroupCategory | null>(null)
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const groupSequenceRef = useRef(20)
  const uploadSequenceRef = useRef(1)
  const anchors = useMemo(() => auditAnchorIds, [])
  const { activeAnchor, registerSection, scrollRef, scrollToAnchor } =
    useAnchorNavigation(anchors, 'audit-project')

  const updateValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }))
  }

  const updateGroupField = (
    category: PlanGroupCategory,
    groupId: string,
    fieldId: string,
    value: string,
  ) => {
    setGroups((current) => ({
      ...current,
      [category]: current[category].map((group) =>
        group.id === groupId
          ? {
              ...group,
              fields: group.fields.map((item) =>
                item.id === fieldId ? { ...item, value } : item,
              ),
            }
          : group,
      ),
    }))
  }

  const addGroup = (category: PlanGroupCategory) => {
    const sequence = ++groupSequenceRef.current
    setGroups((current) => ({
      ...current,
      [category]: [
        ...current[category],
        createPlanGroup(category, current[category].length + 1, `added-${sequence}`),
      ],
    }))
    onNotify(`${planGroupConfigs[category].label}信息已新增`)
  }

  const deleteGroup = (category: PlanGroupCategory, groupId: string) => {
    const config = planGroupConfigs[category]
    const currentGroups = groups[category]
    if (currentGroups.length <= config.minimumGroups) {
      onNotify('施工必须至少保留一组，当前组不可删除', 'error')
      return
    }
    setGroups((current) => ({
      ...current,
      [category]: current[category].filter((group) => group.id !== groupId),
    }))
    onNotify(`${config.label}信息已删除`)
  }

  const addFiles = (category: UploadCategoryId, files: File[]) => {
    if (!files.length) return
    const next = files.map((file) => ({
      id: `${category}-${uploadSequenceRef.current++}`,
      name: file.name,
      size: file.size,
      status: file.size > MAX_UPLOAD_FILE_SIZE ? 'error' as const : 'success' as const,
    }))
    setUploads((current) => ({ ...current, [category]: [...current[category], ...next] }))
    const failedCount = next.filter((file) => file.status === 'error').length
    onNotify(
      failedCount
        ? `${failedCount} 份文件超过 50MB，上传失败`
        : `已上传 ${files.length} 份文件`,
      failedCount ? 'error' : 'success',
    )
  }

  const retryFile = (category: UploadCategoryId, fileId: string) => {
    const file = uploads[category].find((item) => item.id === fileId)
    if (!file) return
    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      onNotify('文件仍超过 50MB，请删除后重新选择', 'error')
      return
    }
    setUploads((current) => ({
      ...current,
      [category]: current[category].map((item) =>
        item.id === fileId ? { ...item, status: 'success' } : item,
      ),
    }))
    onNotify('文件已重新上传')
  }

  const navigate = (id: string) => {
    scrollToAnchor(id)
    setDirectoryOpen(false)
  }

  return (
    <div className="system-shell">
      <header className="system-header">
        <div className="system-header-start">
          <h1>送审管理</h1>
          <button
            type="button"
            className="secondary-button compact-button"
            onClick={onOpenAudit}
          >
            <ClipboardCheck size={16} />
            审计计划
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
              <header className="work-order-header">
                <span>送审资料：1</span>
              </header>
              <div className="audit-content-stack">
                <section className="project-section-card" ref={registerSection('audit-project')}>
                <div className="audit-section-heading">
                  <div className="audit-section-title">
                    <span className="audit-section-icon"><FolderKanban size={20} /></span>
                    <h2>项目资料</h2>
                  </div>
                </div>
                <FieldGrid fields={projectFields} values={values} onChange={updateValue} />
              </section>

              <section ref={registerSection('audit-send-plan')}>
                <PrimaryAnchorHeading icon={Send} title="送审计划" />
              </section>

              {(Object.keys(planGroupConfigs) as PlanGroupCategory[]).map((category) => (
                <GroupSection
                  key={category}
                  category={category}
                  groups={groups[category]}
                  onAdd={() => addGroup(category)}
                  onDelete={(groupId) => deleteGroup(category, groupId)}
                  onOpenSupplier={() => setSupplierCategory(category)}
                  onFieldChange={(groupId, fieldId, value) =>
                    updateGroupField(category, groupId, fieldId, value)
                  }
                  sectionRef={registerSection(`audit-${category}`)}
                />
              ))}

              <DirectPlanSection
                title="甲供物资"
                icon={Boxes}
                fields={suppliedMaterialFields}
                values={values}
                onChange={updateValue}
                sectionRef={registerSection('audit-supplied-material')}
              />
              <DirectPlanSection
                title="其他信息"
                icon={ReceiptText}
                fields={otherInformationFields}
                values={values}
                onChange={updateValue}
                sectionRef={registerSection('audit-other')}
              />

              <section ref={registerSection('audit-attachments')}>
                <PrimaryAnchorHeading icon={Paperclip} title="附件上传列表" />
              </section>

              {uploadCategories.map((category) => (
                <UploadSection
                  key={category.id}
                  category={category}
                  files={uploads[category.id]}
                  onFiles={(files) => addFiles(category.id, files)}
                  onDelete={(fileId) =>
                    setUploads((current) => ({
                      ...current,
                      [category.id]: current[category.id].filter((file) => file.id !== fileId),
                    }))
                  }
                  onRetry={(fileId) => retryFile(category.id, fileId)}
                  sectionRef={registerSection(`audit-${category.id}`)}
                />
              ))}
                <div className="scroll-end-space" aria-hidden="true" />
              </div>
            </div>
            <footer className="send-management-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onNotify('送审管理已保存，尚未提交')}
              >
                <Save size={16} />
                不提交，仅保存
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => onNotify('送审管理已保存并提交')}
              >
                <Send size={16} />
                保存并提交
              </button>
            </footer>
          </div>
        </main>
      </div>

      {supplierCategory && (
        <SupplierModal
          category={supplierCategory}
          onClose={() => setSupplierCategory(null)}
          onSubmit={(name) => {
            setSupplierCategory(null)
            onNotify(`供应商“${name}”已写入数据库`)
          }}
        />
      )}
    </div>
  )
}
