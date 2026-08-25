export type FieldKind = 'text' | 'number' | 'date' | 'amount' | 'readonly'

export interface FieldDefinition {
  id: string
  label: string
  kind: FieldKind
  value: string
  step?: number
}

export interface ContractDefinition {
  id: string
  label: string
  fields: FieldDefinition[]
}

export interface PageDefinition {
  id: string
  label: string
  group: 'submit' | 'review'
  fields?: FieldDefinition[]
  contracts?: ContractDefinition[]
}

const field = (
  id: string,
  label: string,
  kind: FieldKind,
  value: string,
  step?: number,
): FieldDefinition => ({ id, label, kind, value, step })

const contractFields = (contract: 'contract-1' | 'contract-2', values: string[]) => [
  field(`${contract}-name`, '合同名称', 'text', values[0]),
  field(`${contract}-quantity`, '计价工程量', 'number', values[1]),
  field(`${contract}-date`, '审定日期', 'date', values[2]),
  field(`${contract}-adjustment`, '合同调整额（元）', 'amount', values[3], 1000),
  field(`${contract}-reviewed`, '合同送审金额（元）', 'readonly', values[4]),
]

export const pages: PageDefinition[] = [
  {
    id: 'submit',
    label: '送审信息',
    group: 'submit',
    fields: [
      field('submit-company', '送审单位', 'text', '华东建设有限公司'),
      field('submit-contact', '联系电话', 'number', '13800138000'),
      field('submit-date', '送审日期', 'date', '2026-08-24'),
      field('submit-adjustment', '送审调整额（元）', 'amount', '25000.00', 1000),
      field('submit-total', '送审金额（元）', 'readonly', '12,860,000.00'),
    ],
  },
  {
    id: 'overall-review',
    label: '结算总审定',
    group: 'review',
    fields: [
      field('overall-note', '审定说明', 'text', '竣工结算总审定'),
      field('overall-count', '审定批次', 'number', '3'),
      field('overall-date', '审定日期', 'date', '2026-08-28'),
      field('overall-adjustment', '审定调整额（元）', 'amount', '50000.00', 1000),
      field('overall-total', '送审总额（元）', 'readonly', '12,860,000.00'),
    ],
  },
  {
    id: 'construction-review',
    label: '施工费审定',
    group: 'review',
    contracts: [
      {
        id: 'contract-1',
        label: '合同1',
        fields: contractFields('contract-1', [
          '施工总承包合同1',
          '12860.50',
          '2026-08-29',
          '35000.00',
          '6,420,000.00',
        ]),
      },
      {
        id: 'contract-2',
        label: '合同2',
        fields: contractFields('contract-2', [
          '施工总承包合同2',
          '7760.20',
          '2026-08-31',
          '28000.00',
          '3,860,000.00',
        ]),
      },
    ],
  },
  {
    id: 'design-review',
    label: '设计费审定',
    group: 'review',
    fields: [
      field('design-company', '设计单位', 'text', '远景建筑设计院'),
      field('design-count', '设计变更数量', 'number', '12'),
      field('design-date', '审定日期', 'date', '2026-08-30'),
      field('design-adjustment', '设计费调整额（元）', 'amount', '8000.00', 500),
      field('design-total', '设计费送审值（元）', 'readonly', '680,000.00'),
    ],
  },
  {
    id: 'supervision-review',
    label: '监理费审定',
    group: 'review',
    fields: [
      field('supervision-company', '监理单位', 'text', '华衡工程监理公司'),
      field('supervision-months', '监理月数', 'number', '24'),
      field('supervision-date', '审定日期', 'date', '2026-09-01'),
      field('supervision-adjustment', '监理费调整额（元）', 'amount', '6000.00', 500),
      field('supervision-total', '监理费送审值（元）', 'readonly', '520,000.00'),
    ],
  },
  {
    id: 'supplied-materials',
    label: '甲供材料',
    group: 'review',
    fields: [
      field('material-name', '材料名称', 'text', 'HRB400E 级钢筋'),
      field('material-quantity', '送审数量（吨）', 'number', '286.50'),
      field('material-date', '入库日期', 'date', '2026-08-18'),
      field('material-adjustment', '材料调差额（元）', 'amount', '18500.00', 500),
      field('material-total', '送审金额（元）', 'readonly', '1,235,600.00'),
    ],
  },
  {
    id: 'supplied-equipment',
    label: '甲供设备',
    group: 'review',
    fields: [
      field('equipment-name', '设备名称', 'text', '组合式空调机组'),
      field('equipment-quantity', '送审数量（台）', 'number', '18'),
      field('equipment-date', '验收日期', 'date', '2026-08-20'),
      field('equipment-adjustment', '设备调差额（元）', 'amount', '12000.00', 500),
      field('equipment-total', '送审金额（元）', 'readonly', '862,000.00'),
    ],
  },
  {
    id: 'other-costs',
    label: '其他费用审定',
    group: 'review',
    fields: [
      field('other-name', '费用名称', 'text', '工程保险及检测费'),
      field('other-items', '费用项数量', 'number', '8'),
      field('other-date', '审定日期', 'date', '2026-09-02'),
      field('other-adjustment', '费用调整额（元）', 'amount', '5000.00', 500),
      field('other-total', '送审金额（元）', 'readonly', '310,000.00'),
    ],
  },
  {
    id: 'salvaged-materials',
    label: '拆旧物资',
    group: 'review',
    fields: [
      field('salvage-name', '物资名称', 'text', '废旧电缆及桥架'),
      field('salvage-quantity', '清单数量（米）', 'number', '1460'),
      field('salvage-date', '拆除日期', 'date', '2026-08-12'),
      field('salvage-adjustment', '回收调整额（元）', 'amount', '3500.00', 500),
      field('salvage-total', '回收估值（元）', 'readonly', '128,500.00'),
    ],
  },
  {
    id: 'settlement',
    label: '结算',
    group: 'review',
    fields: [
      field('settlement-note', '结算说明', 'text', '工程最终结算'),
      field('settlement-batches', '结算批次', 'number', '4'),
      field('settlement-date', '结算日期', 'date', '2026-09-05'),
      field('settlement-adjustment', '结算调整额（元）', 'amount', '20000.00', 1000),
      field('settlement-total', '审定总额（元）', 'readonly', '12,160,000.00'),
    ],
  },
]

export const reviewPages = pages.filter((page) => page.group === 'review')

export const initialValues = pages.reduce<Record<string, string>>((result, page) => {
  const fields = page.fields ?? page.contracts?.flatMap((contract) => contract.fields) ?? []
  fields.forEach((item) => {
    result[item.id] = item.value
  })
  return result
}, {})
