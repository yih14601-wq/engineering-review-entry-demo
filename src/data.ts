export type FieldKind =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'readonly'
  | 'select'

export interface FieldDefinition {
  id: string
  label: string
  kind: FieldKind
  value: string
  options?: string[]
  step?: number
}

export interface ContractDefinition {
  id: string
  label: string
  fields: FieldDefinition[]
}

export interface EntrySectionDefinition {
  id: string
  label: string
  icon:
    | 'calculator'
    | 'hard-hat'
    | 'ruler'
    | 'clipboard-check'
    | 'boxes'
    | 'monitor-cog'
    | 'receipt-text'
    | 'recycle'
    | 'landmark'
  fields?: FieldDefinition[]
  contracts?: ContractDefinition[]
}

export type PlanGroupCategory = 'construction' | 'design' | 'supervision'

export interface PlanGroup {
  id: string
  fields: FieldDefinition[]
}

export interface PlanGroupConfig {
  id: PlanGroupCategory
  label: string
  icon: 'hard-hat' | 'ruler' | 'clipboard-check'
  unitLabel: string
  typeLabel: string
  options: string[]
  minimumGroups: number
}

export type UploadCategoryId = 'new-files' | 'submitted-files' | 'other-files'

export interface UploadCategory {
  id: UploadCategoryId
  label: string
  icon: 'file-plus' | 'file-check' | 'files'
}

const field = (
  id: string,
  label: string,
  kind: FieldKind,
  value: string,
  options?: string[],
  step?: number,
): FieldDefinition => ({ id, label, kind, value, options, step })

const reviewFields = (
  prefix: string,
  values: [string, string, string, string, string],
  labels: [string, string, string, string, string],
) => [
  field(`${prefix}-name`, labels[0], 'text', values[0]),
  field(`${prefix}-date`, labels[1], 'date', values[1]),
  field(`${prefix}-readonly`, labels[2], 'readonly', values[2]),
  field(`${prefix}-adjustment`, labels[3], 'amount', values[3], undefined, 1000),
  field(`${prefix}-result`, labels[4], 'number', values[4]),
]

const contractFields = (
  prefix: string,
  name: string,
  date: string,
  submitted: string,
  adjustment: string,
  result: string,
) => [
  field(`${prefix}-name`, '合同名称', 'text', name),
  field(`${prefix}-date`, '审定日期', 'date', date),
  field(`${prefix}-submitted`, '合同送审金额（元）', 'readonly', submitted),
  field(`${prefix}-adjustment`, '合同调整额（元）', 'amount', adjustment, undefined, 1000),
  field(`${prefix}-result`, '审定施工费（元）', 'number', result),
]

export const submitFields: FieldDefinition[] = [
  field('submit-company', '送审单位', 'text', '城市更新建设有限公司'),
  field('submit-date', '送审日期', 'date', '2026-08-25'),
  field('submit-count', '送审资料份数', 'readonly', '12 份'),
  field('submit-amount', '送审金额（元）', 'amount', '12,580,000.00', undefined, 1000),
  field('submit-contact', '送审联系人', 'text', '王建华'),
]

export const entryReviewSections: EntrySectionDefinition[] = [
  {
    id: 'overall-review',
    label: '结算总审定',
    icon: 'calculator',
    fields: reviewFields(
      'overall',
      ['竣工结算总审定', '2026-08-28', '12,860,000.00', '50,000.00', '12,160,000.00'],
      ['审定说明', '审定日期', '送审总额（元）', '审定调整额（元）', '审定结算价（元）'],
    ),
  },
  {
    id: 'construction-review',
    label: '施工费审定',
    icon: 'hard-hat',
    contracts: [
      {
        id: 'entry-contract-1',
        label: '合同 1',
        fields: contractFields(
          'entry-contract-1',
          '施工总承包合同 1',
          '2026-08-29',
          '6,420,000.00',
          '35,000.00',
          '6,080,000.00',
        ),
      },
      {
        id: 'entry-contract-2',
        label: '合同 2',
        fields: contractFields(
          'entry-contract-2',
          '施工总承包合同 2',
          '2026-08-31',
          '3,860,000.00',
          '28,000.00',
          '3,690,000.00',
        ),
      },
    ],
  },
  {
    id: 'design-review',
    label: '设计费审定',
    icon: 'ruler',
    fields: reviewFields(
      'design',
      ['远景建筑设计院', '2026-08-30', '680,000.00', '8,000.00', '642,000.00'],
      ['设计单位', '审定日期', '设计费送审值（元）', '设计费调整额（元）', '设计费审定值（元）'],
    ),
  },
  {
    id: 'supervision-review',
    label: '监理费审定',
    icon: 'clipboard-check',
    fields: reviewFields(
      'supervision',
      ['华衡工程监理公司', '2026-09-01', '520,000.00', '6,000.00', '498,000.00'],
      ['监理单位', '审定日期', '监理费送审值（元）', '监理费调整额（元）', '监理费审定值（元）'],
    ),
  },
  {
    id: 'supplied-materials',
    label: '甲供材料',
    icon: 'boxes',
    fields: reviewFields(
      'material',
      ['HRB400E 级钢筋', '2026-08-18', '286.50', '18,500.00', '1,235,600.00'],
      ['材料名称', '入库日期', '送审数量（吨）', '材料调差额（元）', '审定金额（元）'],
    ),
  },
  {
    id: 'supplied-equipment',
    label: '甲供设备',
    icon: 'monitor-cog',
    fields: reviewFields(
      'equipment',
      ['组合式空调机组', '2026-08-20', '18', '12,000.00', '862,000.00'],
      ['设备名称', '验收日期', '送审数量（台）', '设备调差额（元）', '审定金额（元）'],
    ),
  },
  {
    id: 'other-costs',
    label: '其他费用审定',
    icon: 'receipt-text',
    fields: reviewFields(
      'other-costs',
      ['工程保险及检测费', '2026-09-02', '310,000.00', '5,000.00', '286,000.00'],
      ['费用名称', '审定日期', '送审金额（元）', '费用调整额（元）', '审定金额（元）'],
    ),
  },
  {
    id: 'salvaged-materials',
    label: '拆旧物资',
    icon: 'recycle',
    fields: reviewFields(
      'salvage',
      ['废旧电缆及桥架', '2026-08-12', '1,460', '3,500.00', '128,500.00'],
      ['物资名称', '拆除日期', '清单数量（米）', '回收调整额（元）', '回收估值（元）'],
    ),
  },
  {
    id: 'settlement',
    label: '结算',
    icon: 'landmark',
    fields: reviewFields(
      'settlement',
      ['工程最终结算', '2026-09-05', '12,160,000.00', '20,000.00', '12,080,000.00'],
      ['结算说明', '结算日期', '审定总额（元）', '结算调整额（元）', '最终结算额（元）'],
    ),
  },
]

export const entryInitialValues = [...submitFields, ...entryReviewSections.flatMap((section) =>
  section.fields ?? section.contracts?.flatMap((contract) => contract.fields) ?? [],
)].reduce<Record<string, string>>((values, item) => {
  values[item.id] = item.value
  return values
}, {})

export const projectFields: FieldDefinition[] = [
  field('project-name', '项目名称', 'readonly', '城市更新综合改造项目'),
  field('project-type', '项目类型', 'readonly', '工程建设'),
]

export const planGroupConfigs: Record<PlanGroupCategory, PlanGroupConfig> = {
  construction: {
    id: 'construction',
    label: '施工',
    icon: 'hard-hat',
    unitLabel: '施工单位',
    typeLabel: '施工类别',
    options: ['土建施工', '机电安装', '装饰装修', '园林景观'],
    minimumGroups: 1,
  },
  design: {
    id: 'design',
    label: '设计',
    icon: 'ruler',
    unitLabel: '设计单位',
    typeLabel: '设计阶段',
    options: ['方案及初步设计', '施工图设计', '专项设计'],
    minimumGroups: 0,
  },
  supervision: {
    id: 'supervision',
    label: '监理',
    icon: 'clipboard-check',
    unitLabel: '监理单位',
    typeLabel: '监理类型',
    options: ['全过程监理', '专项监理', '施工监理'],
    minimumGroups: 0,
  },
}

const initialGroupValues: Record<PlanGroupCategory, Array<[string, string, string, string]>> = {
  construction: [
    ['华建工程有限公司', '土建施工', '8,620,000.00', '8,380,000.00'],
    ['城建安装有限公司', '机电安装', '5,460,000.00', '5,280,000.00'],
  ],
  design: [
    ['远景建筑设计院', '施工图设计', '680,000.00', '648,000.00'],
    ['华城规划设计院', '方案及初步设计', '520,000.00', '498,000.00'],
  ],
  supervision: [
    ['华衡工程监理公司', '全过程监理', '920,000.00', '886,000.00'],
    ['建信项目管理公司', '专项监理', '460,000.00', '445,000.00'],
  ],
}

export const createPlanGroup = (
  category: PlanGroupCategory,
  _sequence: number,
  uniqueKey: string,
  values?: [string, string, string, string],
): PlanGroup => {
  const config = planGroupConfigs[category]
  const current = values ?? ['', config.options[0], '0.00', '0.00']
  const prefix = `${category}-${uniqueKey}`

  return {
    id: prefix,
    fields: [
      field(`${prefix}-unit`, config.unitLabel, 'text', current[0]),
      field(`${prefix}-type`, config.typeLabel, 'select', current[1], config.options),
      field(`${prefix}-contract`, '合同金额（元）', 'amount', current[2], undefined, 1000),
      field(`${prefix}-submitted`, '送审金额（元）', 'amount', current[3], undefined, 1000),
    ],
  }
}

export const initialPlanGroups = (Object.keys(planGroupConfigs) as PlanGroupCategory[]).reduce(
  (groups, category) => {
    groups[category] = initialGroupValues[category].map((values, index) =>
      createPlanGroup(category, index + 1, `initial-${index + 1}`, values),
    )
    return groups
  },
  {} as Record<PlanGroupCategory, PlanGroup[]>,
)

export const suppliedMaterialFields: FieldDefinition[] = [
  field('plan-material-name', '物资名称', 'text', '低压配电柜'),
  field('plan-material-type', '物资类别', 'select', '电气设备', ['电气设备', '建筑材料', '暖通设备']),
  field('plan-material-purchase', '采购金额（元）', 'amount', '862,000.00', undefined, 1000),
  field('plan-material-submitted', '送审金额（元）', 'amount', '848,000.00', undefined, 1000),
  field('plan-material-supplier', '供应商', 'text', '华东设备供应公司'),
]

export const otherInformationFields: FieldDefinition[] = [
  field('plan-other-name', '事项名称', 'text', '专项检测服务'),
  field('plan-other-type', '费用类别', 'select', '专项检测费', ['专项检测费', '工程保险费', '咨询服务费']),
  field('plan-other-contract', '合同金额（元）', 'amount', '360,000.00', undefined, 1000),
  field('plan-other-submitted', '送审金额（元）', 'amount', '342,000.00', undefined, 1000),
  field('plan-other-unit', '提报单位', 'text', '项目管理部'),
]

export const planInitialValues = [
  ...projectFields,
  ...suppliedMaterialFields,
  ...otherInformationFields,
].reduce<Record<string, string>>((values, item) => {
  values[item.id] = item.value
  return values
}, {})

export const uploadCategories: UploadCategory[] = [
  { id: 'new-files', label: '新的附件', icon: 'file-plus' },
  { id: 'submitted-files', label: '送审附件', icon: 'file-check' },
  { id: 'other-files', label: '其他资料', icon: 'files' },
]
