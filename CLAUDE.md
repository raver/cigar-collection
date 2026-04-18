# 烟标记忆 - 项目说明

## 项目概述
展示个人收藏的旧烟标（纸质烟盒）图片的网站。80年代怀旧风格，带点感伤。

## 技术栈
- **前端**: SvelteKit (TypeScript) — SSR/SSG
- **样式**: Tailwind CSS v4（CSS-first 配置，@theme 自定义色板）
- **后端**: Hono (TypeScript) — API 服务
- **ORM**: Drizzle ORM（TypeScript schema 定义，自动推导类型）
- **数据库**: PostgreSQL（复用VPS现有实例）
- **图片存储**: Cloudflare R2（原图 + 水印版两份）
- **部署**: Docker Compose + Nginx（腾讯云新加坡VPS）
- **CDN/DNS**: Cloudflare

## 设计文档
- 完整设计文档: `docs/superpowers/specs/2026-04-17-cigar-collection-website-design.md`
- 实施计划: `docs/superpowers/plans/2026-04-18-cigar-collection-website.md`

## 设计稿（HTML mockup）
- `homepage-v3.html` — 首页（含烟雾粒子动画 + 真实图片）
- `gallery.html` — 图库（含灯箱放大 + 筛选）
- `guestbook.html` — 留言墙
- `about.html` — 关于

## 字体
- **标题**: ZCOOL XiaoWei（站酷小薇，文雅怀旧）
- **正文**: Noto Serif SC（经典宋体，多字重）
- **题词**: Ma Shan Zheng（马善政，手写体）

## 数据库表
- `cigars` — 烟标元数据（name, factory, era, theme, slug, 图片路径）
- `comments` — 留言（烟标留言 + 公共留言，cigar_id为NULL时是公共留言）
- `admins` — 管理员

## 关键设计决策
- 前后端分离：SvelteKit 前端 + Hono API
- 搜索：前端过滤（数据量小，100-500条）
- 留言：先审后发，逻辑删除（删除烟标时物理删除）
- 图片水印：Sharp 库，服务端处理，R2 存原图和水印版
- 视觉风格：街头巷尾（深绿/灰绿/水泥灰），白天/夜晚双主题
- 页面：首页、图库、烟标详情、公共留言、关于、管理后台
- 详情页布局：PC左图右文，移动端上图下文
- 图片交互：灯箱放大效果
- Nginx 路由：`/` → SvelteKit，`/api/*` → Hono

## 用户信息
- Jude，熟悉 TypeScript + SvelteKit + Hono + Docker
- VPS 上已有 Docker + PostgreSQL + Nginx 环境
- 短期不备案（海外VPS），未来可能迁回国内
- 项目目的：个人收藏展示 + 怀旧纪念 + 技术作品集
