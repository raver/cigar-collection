# 烟标记忆 - 收藏展示网站设计文档

## 背景

Jude 收集了约100张旧烟标（纸质烟盒），希望创建一个网站来展示这些烟标图片。网站既是个人收藏展示，也承载80年代怀旧的情感记忆，同时作为个人技术作品集的一部分。

图片量初期约100张，预计增长到500张。网站面向国内用户，短期不备案（部署在海外VPS），效果好的话未来会迁回国内并备案。

## 技术架构

### 整体架构：前后端分离

```
用户 → Cloudflare (DNS + CDN + SSL) → Nginx (反向代理)
                                         │
                          ┌──────────────┼──────────────┐
                          │              │              │
                     SvelteKit        Hono API      静态资源
                     (前端+SSR)      (后端服务)
                          │              │
                          │         ┌────┴────┐
                          │         │         │
                    R2 (图片)   PostgreSQL  R2 (图片)
```

### 技术栈

| 组件 | 选择 | 理由 |
|------|------|------|
| 前端框架 | SvelteKit | SSR/SSG支持好，SEO友好，用户熟悉 |
| 后端API | Hono | 轻量高效，TypeScript原生，用户熟悉 |
| 数据库 | PostgreSQL | 复用VPS上现有的PostgreSQL实例 |
| 图片存储 | Cloudflare R2 | 无出口流量费，平台解绑，可随时迁移 |
| 反向代理 | Nginx | 复用VPS上现有的Nginx |
| 容器编排 | Docker Compose | 一键部署，用户熟悉Docker |
| CDN | Cloudflare | 已在用，R2自动集成 |

### Nginx 路由规则

- `/` → SvelteKit 容器
- `/api/*` → Hono API 容器
- `/admin/api/*` → Hono API 容器

### Docker 容器

- `cigar-web` — SvelteKit 应用（SSR模式）
- `cigar-api` — Hono API 服务
- 复用现有的 PostgreSQL 容器（新建 database）

## 页面设计

### 1. 首页 `/`

- 网站标题 + 怀旧文字介绍
- 随机展示 6-12 个烟标（每次刷新随机选取）
- "浏览全部"按钮跳转图库
- SSR渲染，SEO优化

### 2. 图库 `/gallery`

- 搜索栏：名称（输入框）、卷烟厂（下拉）、年代（下拉）、主题（下拉）
- 烟标网格展示（缩略图 + 名称 + 年代）
- 前端即时过滤（所有烟标数据一次性加载）
- 分页或无限滚动

### 3. 烟标详情 `/cigar/[slug]`

- PC端：左图右信息布局
- 移动端：上图下信息布局
- 大图展示，点击可灯箱放大（Lightbox）
- 属性信息：名称、卷烟厂、年代、主题
- 该烟标的留言列表
- 留言表单（姓名 + 邮箱 + 内容）
- 留言引用功能
- SSR渲染，独立URL（如 `/cigar/da-qian-men`），SEO友好

### 4. 公共留言 `/guestbook`

- 留言表单（姓名 + 邮箱 + 内容）
- 已审核的公共留言列表（分页）
- 留言引用功能
- 独立页面，全站交流区

### 5. 关于 `/about`

- 项目介绍、收藏故事、联系方式
- 静态页面
- 可作为作品集入口

### 6. 管理后台 `/admin`

- 简单密码认证（bcrypt）
- 留言审核：查看待审核留言，通过/拒绝
- 留言管理：删除/隐藏已发布留言
- 烟标管理：添加新烟标（上传图片 + 填写属性）、编辑属性、删除烟标

## 数据模型

### cigars 烟标表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | NOT NULL | 烟标名称 |
| factory | VARCHAR(100) | NOT NULL | 卷烟厂名称 |
| era | VARCHAR(20) | NOT NULL | 年代：80年代/90年代/2000年以后/不详 |
| theme | VARCHAR(50) | NOT NULL | 主题：风景/人物/建筑/动物等 |
| image_original | VARCHAR(255) | NOT NULL | R2 原图路径 |
| image_watermarked | VARCHAR(255) | NOT NULL | R2 水印版路径 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL友好标识 |
| created_at | TIMESTAMP | DEFAULT NOW() | 入库时间 |

索引：slug, factory, theme, era

### comments 留言表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| cigar_id | INTEGER | FK→cigars.id, NULLABLE | 有值=烟标留言，NULL=公共留言 |
| author_name | VARCHAR(50) | NOT NULL | 留言者姓名（公开展示） |
| author_email | VARCHAR(100) | NOT NULL | 留言者邮箱（不公开） |
| content | TEXT | NOT NULL | 留言正文（纯文本） |
| quote_id | INTEGER | FK→comments.id, NULLABLE | 引用的留言ID |
| status | VARCHAR(20) | DEFAULT 'pending' | pending/approved/rejected/hidden/deleted |
| created_at | TIMESTAMP | DEFAULT NOW() | 留言时间 |

索引：cigar_id, status, created_at

### admins 管理员表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| username | VARCHAR(50) | UNIQUE NOT NULL | 管理员用户名 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt密码哈希 |

### 表关系

- cigars 1←→N comments（一个烟标有多条留言）
- comments 1←→N comments（引用关系，单层）
- comments.cigar_id 为 NULL 时是公共留言

## Hono API 路由设计

### 公开接口

- `GET /api/cigars` — 获取所有烟标数据（前端搜索用）
- `GET /api/cigars/:slug` — 获取单个烟标详情
- `GET /api/cigars/:id/comments` — 获取某烟标的已审核留言
- `GET /api/guestbook` — 获取公共留言（分页）
- `POST /api/comments` — 提交留言（烟标或公共）

### 管理接口（需认证）

- `POST /api/admin/login` — 登录
- `GET /api/admin/comments?status=pending` — 获取待审核留言
- `PATCH /api/admin/comments/:id` — 审核留言（通过/拒绝/隐藏）
- `DELETE /api/admin/comments/:id` — 逻辑删除留言（status改为deleted）
- `POST /api/admin/cigars` — 添加烟标（含图片上传+水印处理）
- `PUT /api/admin/cigars/:id` — 编辑烟标属性
- `DELETE /api/admin/cigars/:id` — 物理删除烟标及其所有留言

## 视觉设计

### 风格：街头巷尾 — 80年代怀旧

深绿、灰绿、水泥灰。像老弄堂、厂区围墙、自行车棚。淡淡的忧伤，内敛的怀旧。

### 白天模式色彩

| 用途 | 颜色 | 说明 |
|------|------|------|
| 页面背景 | #F5F5F0 | 浅灰暖白 |
| 导航/强调 | #2D4A3E | 深墨绿 |
| 按钮/链接 | #4A6741 | 中绿 |
| 次要文字 | #708090 | 水泥灰 |
| 卡片背景 | #FFFFFF | 纯白 |

### 夜晚模式色彩

| 用途 | 颜色 | 说明 |
|------|------|------|
| 页面背景 | #0D1A15 | 深墨绿黑 |
| 卡片/导航 | #1A2A25 | 深绿 |
| 主要文字 | #8FBC8F | 暗海绿 |
| 按钮/链接 | #4A6741 | 中绿 |
| 次要文字 | #6B8E23 | 橄榄绿 |

### 字体

- 中文正文：楷体 (KaiTi) / Noto Serif SC
- 标题：宋体 (SimSun) / Noto Serif SC Bold
- 英文/数字：系统等宽字体

### 响应式断点

- 移动端：< 768px，单列布局，上图下文
- 平板：768px - 1024px，两列布局
- 桌面：> 1024px，三列网格，详情页左图右文

## 图片水印方案

### 处理流程

1. 管理员通过后台上传烟标原图
2. Hono 后端接收图片，使用 Sharp 库添加水印
3. 原图和水印版分别上传到 R2 的不同目录
4. 数据库记录两个路径

### R2 存储结构

```
cigar-images/
├── originals/          ← 原图（管理员可见）
│   ├── da-qian-men.jpg
│   └── mudan.jpg
└── watermarked/        ← 水印版（公开展示）
    ├── da-qian-men.jpg
    └── mudan.jpg
```

### 水印样式

- 半透明白色文字（透明度约25%）
- 30度斜角排列
- 平铺覆盖整张图片
- 内容：网站名称 + 域名

## 留言功能

### 规则

- 不需要用户登录
- 留言必须提供：姓名 + 邮箱 + 内容
- 邮箱不公开展示，仅管理员可见
- 所有留言需管理员审核后才公开（先审后发）
- 支持引用同页面内其他用户的留言（单层，无嵌套）
- 纯文本，不支持HTML或富文本
- 单条留言删除为逻辑删除（status改为deleted），保留数据以确保引用完整
- 删除烟标时物理删除烟标及其所有留言（烟标数据无保留意义时）

### 引用机制

- 留言表单提供"引用"按钮，点击某条留言可引用
- 引用时显示被引用留言的作者名和内容摘要
- 引用通过 quote_id 关联，前端渲染时展示引用内容

## SEO

- SvelteKit SSR/SSG 渲染，搜索引擎可抓取
- 每个烟标详情页有独立 URL（slug）
- 每个页面有独立的 meta 标题和描述
- 图片有 alt 标签
- 自动生成 sitemap.xml
- 主要面向 Google，未来迁回国内后也兼容百度

## 部署

### 当前方案

- 腾讯云新加坡轻量VPS
- Docker Compose 编排所有服务
- Cloudflare DNS + CDN
- R2 绑定自定义域名（如 img.yourdomain.com）

### 未来迁移

- 代码和数据库搬到国内VPS
- 域名备案
- 图片存储可迁移到国内对象存储（如七牛云），只改DNS解析
- Cloudflare DNS 可继续使用

## 不做的事情（YAGNI）

- 用户注册/登录系统
- 留言嵌套回复（仅单层引用）
- 富文本编辑器
- 全文搜索引擎（Elasticsearch等）
- 国际化/多语言
- 访问统计后台（用 Cloudflare Analytics 或 Google Analytics）
- 图片CDN加速优化（当前规模不需要）
- 70年代选项（用户确认不需要）
