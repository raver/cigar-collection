# 代码审查记录 — 2026-04-18

> 对 feat/implementation 分支全部实现的审查记录，包含发现的问题、修复状态和已知待完善项。

## 审查范围

- 15 个 commit，涵盖前后端全栈实现
- 对比基准：设计文档 + 实施计划

---

## 已修复的问题

### 安全问题

| 编号 | 问题 | 严重度 | 修复方式 |
|------|------|--------|----------|
| C2 | logout API 未实现，cookie 不会被清除 | 关键 | 在 admin.ts 添加 POST /logout 路由，调用 deleteCookie |
| C3 | HMAC 验证使用 `!==` 字符串比较，存在时序攻击风险 | 关键 | 改用 `crypto.timingSafeEqual` 进行恒定时间比较 |
| C4 | CORS 全开 `*`，管理 API 允许跨域 CSRF | 关键 | 公开 API 保持宽松，管理 API 限制 origin（环境变量 `ADMIN_ORIGIN`） |

### 功能问题

| 编号 | 问题 | 严重度 | 修复方式 |
|------|------|--------|----------|
| C6 | 烟标详情页无错误处理，API 异常时页面崩溃 | 关键 | 添加 try-catch，404 返回友好错误页面 |
| I2 | 前端邮箱标为选填，后端 Zod 要求必填，提交会 400 | 重要 | 前端改为 required，校验提示更新 |
| I7 | sitemap.xml 的 baseUrl 硬编码为占位符 | 重要 | 改用 `process.env.PUBLIC_SITE_URL` 环境变量 |

### 代码质量

| 编号 | 问题 | 修复方式 |
|------|------|----------|
| I4 | 图库分页是假 UI | 移除假分页，显示总数统计 |
| M5 | app.html 有不必要的 `data-sveltekit-prerender` | 移除 |
| M6 | admin layout 只检查 cookie 存在性 | 添加注释说明安全由 API 层保障 |
| M7 | FilterBar 有空 `oninput`/`onchange` 回调 | 清理移除 |
| I8 | 缺少 robots.txt | 添加到 web/static/ |
| TS | Drizzle schema 自引用导致 TypeScript 编译错误 | 给 references 回调添加 `(): any` 返回类型 |

---

## 已知待完善项

以下问题在审查中发现，但优先级较低，可以后续迭代中处理：

### 功能缺失

| 编号 | 问题 | 建议 |
|------|------|------|
| I1 | 留言引用功能未实现 | 后端 schema 支持 quote_id，需要：1) 后端 join 查询获取被引用留言 2) CommentForm 添加引用按钮 3) CommentList 渲染引用内容 |
| - | 管理后台缺少编辑烟标 UI | API 已支持 PUT，前端只有添加和删除 |
| - | 登录缺少速率限制 | 可用 Hono rateLimit 中间件，个人网站风险有限 |

### 性能优化

| 编号 | 问题 | 建议 |
|------|------|------|
| M1 | 数据库缺少索引 | 100-500 条数据无影响，数据增长后考虑给 factory/theme/era 加索引 |

### 部署前检查

| 项目 | 说明 |
|------|------|
| `.env` 配置 | 需要设置 DATABASE_URL、R2 凭据、SESSION_SECRET、ADMIN_ORIGIN、PUBLIC_SITE_URL |
| 数据库迁移 | 运行 `pnpm drizzle-kit push` 或手动执行 migration SQL |
| 占位符 | about 页面联系邮箱 hello@example.com 需要替换 |
| Nginx 域名 | nginx/default.conf 的 server_name 需要替换 |
| 管理员账号 | 首次部署需要手动插入 admins 表记录 |

---

## 审查结论

实现与设计文档整体对齐度高，架构合理。关键安全漏洞已修复，功能问题已处理。剩余的留言引用功能和编辑 UI 属于功能完善级别，不影响部署。
