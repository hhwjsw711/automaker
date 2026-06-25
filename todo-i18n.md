# i18n 国际化实施计划

## Phase 1 — 基础设施 ✅
- [x] 安装 i18next + react-i18next + i18next-browser-languagedetector
- [x] 创建 src/i18n/ 配置、locale 检测、翻译文件 (en/zh)
- [x] 创建 I18nProvider 包装组件
- [x] 修改 __root.tsx：<html lang/dir>、locale 检测 inline script
- [x] 创建 LanguageSwitcher 组件
- [x] Header 集成 LanguageSwitcher + 15 处字符串提取
- [x] 构建验证通过

## Phase 2 — UI 字符串提取（按优先级）

### P0 — Header & Footer (~50 strings) ✅
- [x] Header NAVIGATION_LINKS 标签全部接入 t() （Course Content, Pricing, Discord, Members, Blog, Launch Kits, AI News, Agents, Affiliate Program 等）
- [x] Header badge 文本（NEW, Beta）
- [x] Header ADMIN_MENU_ITEMS 和 ADMIN_CATEGORY_LABELS
- [x] Header Admin 下拉菜单（Admin avatar span, 各 label）
- [x] Header 用户下拉菜单（Edit Profile, Settings, Logout, Affiliate Dashboard）
- [x] Header 移动端菜单完整 i18n
- [x] Footer 所有文本

### P1 — Landing Page 核心 (~100 strings) ✅
- [x] Hero section (unified-hero.tsx) — 主版本
- [x] Pricing section (pricing.tsx)
- [x] Modules section (modules.tsx) — 标签文字
- [x] Stats section (stats.tsx)
- [x] Instructor section (instructor-section.tsx)
- [x] Testimonials section (testimonials.tsx)
- [x] Newsletter section (newsletter.tsx)

### P2 — FAQ + 其余内容段 (~100 strings) ✅
- [x] FAQ section (faq.tsx) — 12 general QA pairs
- [x] Research Sources (research-sources.tsx) — 6 cards × 4 strings
- [x] Future of Coding (future-of-coding.tsx) — 3 feature cards
- [x] Discord Community (discord-community-section.tsx) — 3 highlight cards
- [x] Newsletter Form (newsletter-form.tsx) — form + stats
- [ ] Early Access Hero (unified-hero.tsx 的第二套 UI) — 延后
- [ ] Early Access FAQ (faq.tsx isEarlyAccess block) — 延后

### P3a — 核心页面 (~230 strings) ✅
- [x] 购买流程 (purchase.tsx, success.tsx, cancel.tsx)
- [x] 404/error 页面 (NotFound, DefaultCatchBoundary, unauthorized, unauthenticated)
- [x] Settings 页面 (settings.tsx)
- [x] Affiliates 页面 (affiliates.tsx)
- [x] Affiliate Dashboard (affiliate-dashboard.tsx)

### P3b — Learn 学习区 (~200 strings) ✅
- [x] Course pages (index, add, edit, course-completed, not-found, no-segments)
- [x] Navigation (desktop, mobile, module-panel)
- [x] Module management (accordion-header, segment-item, new-module, delete-module, edit-module-dialog)
- [x] Segment form (segment-form.tsx)
- [x] Video player (video-header, video-controls, video-content-tabs-panel, content-panel)
- [x] Comments (comment-list, comment-form, comments-panel)
- [x] Admin tools (delete-segment-button, generate-transcript-button, transcode-video-button, edit-video-button)
- [x] Premium gate (upgrade-placeholder)
- [x] Quick navigation bar
- [x] Course search, assignments, user-menu

### P3c — 剩余公开页面 (~120 strings)
- [ ] Members 页面 (members.tsx)
- [ ] Community 页面 (community.tsx)
- [ ] Profile 页面 (profile/edit.tsx, profile/$userId.tsx)
- [ ] Blog 公开页 (blog/index.tsx, blog/$slug.tsx)
- [ ] News 公开页 (news.tsx)
- [ ] Agents 公开页 (agents/index.tsx, agents/new.tsx, agents/$slug.tsx, agent-form.tsx)
- [ ] Launch Kits 公开页 (launch-kits/) — 7 个文件
- [ ] Unsubscribe 页面 (unsubscribe.tsx)
- [ ] Create Testimonial (create-testimonial.tsx)
- [ ] Dev Login (dev-login.tsx)
- [ ] About / Login 存根页
- [ ] Early Access Hero + FAQ（延后）

### P3d — Admin 后台 (~680 strings)
- [ ] Admin layout + nav (admin-nav.tsx)
- [ ] Analytics, UTM Analytics, Conversions (3 个路由 + 子页面)
- [ ] User Management (comments, users 列表 + 详情, affiliates)
- [ ] Content Management (blog, news, launch-kits CRUD)
- [ ] Email 系统 (emails/ 路由 + 子组件)
- [ ] Settings (feature-flag-card, targeting-dialog)
- [ ] Video Processing / Vectorization
- [ ] Vector Search / Chat

### P3e — 法律页面 (~175 strings, 特殊处理)
- [ ] Privacy Policy (静态长文本)
- [ ] Terms of Service (静态长文本)
- [ ] Refund Policy (静态长文本)

## Phase 3 — 语言切换器 + SEO
- [ ] <link rel="alternate" hreflang="x" /> 支持
- [ ] sitemap.xml 多语言
- [ ] <meta og:locale> 标签

## Phase 4 — 数据库内容国际化 🔮 (需 migration)
- [ ] segments 表加 locale 列
- [ ] modules 表加 locale 列
- [ ] agents 表加 locale 列
- [ ] blog_posts 表加 locale 列
- [ ] news_entries 表加 locale 列
- [ ] launch_kits 表加 locale 列
- [ ] launch_kit_categories/tags 表加 locale 列
- [ ] email_templates 表加 locale 列
- [ ] 更新 seed data 支持多语言
- [ ] Admin CRUD 支持逐语言编辑

## Phase 5 — RTL 支撑
- [ ] 关键 CSS 物理方向 → 逻辑属性
- [ ] Tailwind rtl: variant 启用
- [ ] E2E 测试多语言

## Phase 6 — 视频多语言（后续）🔮
- [ ] segments 已有 locale 列（Phase 4）
- [ ] video_processing_jobs 加 locale 列
- [ ] Whisper 多语言转录
- [ ] 机器翻译字幕 → 生成 .vtt
- [ ] transcript_chunks 加 locale 列
- [ ] VideoPlayer 字幕选择器
- [ ] VideoContentTabsPanel 按 locale 显示内容
