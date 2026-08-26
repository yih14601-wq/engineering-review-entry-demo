# Vue 迁移指南

当前 Demo 使用 React 19 + Vite + TypeScript 实现。目标系统是 Vue 时，推荐只迁移结构、样式、数据模型和交互逻辑，不直接复用 React 组件。

## 建议组件拆分

| Vue 组件 | 对应源码 | 说明 |
| --- | --- | --- |
| `SendManagementPage.vue` | `src/AuditPlanPage.tsx` | 送审管理完整页面 |
| `AuditPlanPage.vue` | `src/FinalAuditPlanPage.tsx` | 审计计划完整页面 |
| `EntryReviewDrawer.vue` | `src/EntryReviewDrawer.tsx` | 录入审定信息右侧抽屉 |
| `AnchorDirectory.vue` | 三个页面内的目录组件 | 左侧锚点导航，高亮和跟随滚动 |
| `useAnchorNavigation.ts` 或 composable | `src/useAnchorNavigation.ts` | 可改写为 Vue `useAnchorNavigation` composable |
| `FormField.vue` | `src/FormField.tsx` | 文本、数值、日期、金额步进、下拉、只读预览 |
| `FieldGrid.vue` | `src/FormField.tsx` | 字段网格 |
| `FileUploadPanel.vue` | `src/FileUploadPanel.tsx` | 附件上传空状态、成功、失败、重试、删除 |
| `SupplierModal.vue` | `src/AuditPlanPage.tsx` | 新增供应商弹窗 |
| `PreviewAttachmentGrid.vue` | `src/FinalAuditPlanPage.tsx` | 审计计划附件预览 |
| `ImagePreviewModal.vue` | `src/FinalAuditPlanPage.tsx` | 定案单扫描件放大 |
| `FixedActionBar.vue` | 页面底部 footer | 固定底部操作栏 |

## Vue composable：锚点滚动逻辑

React 版核心逻辑在 `src/useAnchorNavigation.ts`：

- 保存滚动容器 ref。
- 保存每个 section 的 DOM ref。
- 点击目录时，计算 section 相对滚动容器的位置并 `scrollTo`。
- 监听滚动容器 `scroll`，根据 section 顶部位置更新 active anchor。
- 到达底部时强制激活最后一个 anchor。
- 审计计划目录项很多，左侧目录也要在 active anchor 变化时自动滚动，确保高亮项可见。

Vue 建议结构：

```ts
export function useAnchorNavigation(anchorIds: string[], defaultAnchor: string) {
  const scrollRef = ref<HTMLElement | null>(null)
  const sectionRefs = reactive<Record<string, HTMLElement | null>>({})
  const activeAnchor = ref(defaultAnchor)

  function registerSection(id: string, el: HTMLElement | null) {
    sectionRefs[id] = el
  }

  function scrollToAnchor(id: string) {
    // 参考 React 实现：targetTop = sectionTop - containerTop + scrollTop - 24
  }

  onMounted(() => {
    // 监听 scroll 和 resize
  })

  onBeforeUnmount(() => {
    // 移除监听
  })

  return { scrollRef, activeAnchor, registerSection, scrollToAnchor }
}
```

## 数据迁移

数据定义集中在 `src/data.ts`。如果原系统已有接口：

- 保留字段类型枚举：`text`、`number`、`date`、`amount`、`readonly`、`select`。
- 字段至少包含：`id`、`label`、`kind`、`value`。
- 下拉字段包含：`options`。
- 金额步进字段包含：`step`，默认 `1000`。
- 分组数据要有稳定 `id`，用于删除、更新、渲染 key。

## 图标

当前使用 `lucide-react`。Vue 可使用：

- `lucide-vue-next`
- 或原系统已有图标库，但语义要一致。

重要图标语义：

- 一级标题：蓝底白色图标方块。
- 二级标题：32x32 浅蓝圆形图标。
- 三级合同标题：28x28 绿色系图标。
- 只读预览：锁图标，不显示“只读/禁用”文字。
- 附件上传：上传、文件、成功、失败、重试、删除图标。

## 样式迁移

优先复制 `src/styles.css` 的变量和布局规则。若原系统已有 CSS 体系，可以把变量映射到原系统 token，但以下视觉不要改：

- 主蓝色、灰底卡片、边框色、字体层级。
- 左侧导航选中态无圆角。
- 字段高度 72px。
- 二级普通字段宽度约 360px，高度 72px。
- 三级合同字段宽度约 340px，高度 72px。
- 灰色卡片统一内边距。

## 嵌入建议

- 如果原系统有顶部栏和侧边栏，请只嵌入工单主体内容，避免重复外壳。
- `送审管理` 和 `审计计划` 可以作为 Vue 路由页面。
- `录入审定信息` 建议作为全局抽屉组件，由按钮控制显示。
- Toast、Modal、Drawer 如果原系统已有组件，可以接入原系统组件，但视觉尺寸需贴近 Demo。

## 不要改的内容

- 不要把锚点导航改成分页或 Tab。
- 不要恢复左侧展开箭头。
- 不要在空状态里写“字段组”。
- 不要把定案单类型做成下拉。
- 不要把附件上传成功态做回旧版居中堆叠卡片。
