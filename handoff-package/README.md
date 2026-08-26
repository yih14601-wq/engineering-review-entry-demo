# 工程审计业务系统交付包

本交付包用于把当前 Demo 页面交给另一个前端团队嵌入原系统。原系统技术栈为 Vue 时，请以本目录文档作为迁移协议，以仓库源码作为可运行参考实现。

## 推荐交付内容

请把以下内容一起发给前端：

- GitHub 仓库地址：https://github.com/yih14601-wq/engineering-review-entry-demo
- 在线 Demo：https://yih14601-wq.github.io/engineering-review-entry-demo/
- 本目录：`handoff-package/`
- Pencil 最终设计稿：用于核对视觉、间距、状态和交互图

## 页面范围

- `送审管理`：完整页面，左侧和顶部区域为空白占位，工单卡片在右下区域。
- `录入审定信息`：从顶部按钮打开的右侧抽屉弹窗。
- `审计计划`：完整页面，布局与送审管理一致，全部字段为预览状态。

## 关键实现原则

- 三个主要业务区域均使用“左侧导航锚点 + 内容区纵向滚动定位”，不是分页。
- 左侧导航无展开箭头，一级/二级层级靠缩进、图标、圆点和选中态区分。
- 内容滚动时，左侧导航必须同步高亮并自动跟随滚动到当前项。
- 底部操作栏固定在工单底部，不随内容滚动。
- `送审管理` 工单内的 `送审资料：1` 不固定，跟随内容滚动。
- 附件上传成功后统一使用紧凑文件列表样式。
- `施工` 至少保留 1 组，不允许删除到 0；`设计`、`监理` 可删除到 0 并展示空状态。

## 目录说明

- `AI_PROMPT_FOR_VUE.md`：可直接给对方 AI 的迁移提示词。
- `VUE_MIGRATION_GUIDE.md`：Vue 嵌入和组件拆分建议。
- `COMPONENT_AND_INTERACTION_SPEC.md`：组件、状态、交互规范。
- `PAGE_CONTRACT.json`：AI 友好的页面结构与约束。
- `SOURCE_MAP.md`：当前 React/Vite 源码文件对应关系。
- `ACCEPTANCE_CHECKLIST.md`：交付验收清单。

## 本地运行当前 Demo

```bash
pnpm install
pnpm dev
```

生产检查：

```bash
pnpm typecheck
pnpm build
```

## 给 Vue 前端的建议

不要直接把 React 代码塞进 Vue 项目。建议按以下方式迁移：

- 读取 `PAGE_CONTRACT.json` 确认页面结构。
- 按 `COMPONENT_AND_INTERACTION_SPEC.md` 重建 Vue 组件。
- 从 `src/styles.css` 迁移设计 token、布局、字段、导航、附件上传样式。
- 从 `src/data.ts` 迁移 mock 数据结构或映射到接口数据。
- 用在线 Demo 做交互验收，用 Pencil 做视觉验收。
