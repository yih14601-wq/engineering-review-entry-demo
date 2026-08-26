# 源码对应关系

当前可运行参考实现位于仓库根目录。

| 文件 | 用途 |
| --- | --- |
| `src/App.tsx` | 页面切换、录入审定信息抽屉开关、全局 toast |
| `src/AuditPlanPage.tsx` | 送审管理页面 |
| `src/FinalAuditPlanPage.tsx` | 审计计划页面 |
| `src/EntryReviewDrawer.tsx` | 录入审定信息抽屉 |
| `src/FormField.tsx` | 表单字段组件和字段网格 |
| `src/FileUploadPanel.tsx` | 附件上传组件 |
| `src/useAnchorNavigation.ts` | 锚点滚动和当前项高亮逻辑 |
| `src/data.ts` | 页面 mock 数据、字段类型、分组配置 |
| `src/styles.css` | 全部页面视觉样式和响应式适配 |
| `public/pencil-assets/xLnSs.png` | 定案单扫描件预览图 |
| `public/pencil-assets/Gie4P.png` | 页面视觉资产 |

## 迁移优先级

1. 先迁移 `src/styles.css` 中的 token、布局、字段、导航和上传组件样式。
2. 再迁移 `src/data.ts` 的数据结构。
3. 再迁移 `src/useAnchorNavigation.ts` 的滚动逻辑。
4. 最后按页面拆分 Vue 组件。

## 关键源码点

- 送审管理的施工最小组数：`src/data.ts` 中 `planGroupConfigs.construction.minimumGroups = 1`。
- 设计/监理允许为空：`minimumGroups = 0`。
- 附件最大大小：`src/FileUploadPanel.tsx` 中 `MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024`。
- 录入审定信息一级/二级结构：`src/data.ts` 中 `submitFields` 和 `entryReviewSections`。
- 审计计划目录结构：`src/FinalAuditPlanPage.tsx` 中 `directoryGroups` 和 `auditAnchorIds`。

## 在线核对

在线 Demo：

https://yih14601-wq.github.io/engineering-review-entry-demo/

建议 Vue 实现完成后逐项对照：

- 送审管理默认页。
- 打开录入审定信息抽屉。
- 点击顶部审计计划按钮。
- 审计计划长页面滚动和左侧目录跟随。
- 附件上传空状态、成功状态、失败状态。
