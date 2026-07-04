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
- [x] Header NAVIGATION_LINKS 标签全部接入 t()
- [x] Header badge 文本（NEW, Beta）
- [x] Header ADMIN_MENU_ITEMS 和 ADMIN_CATEGORY_LABELS
- [x] Header Admin 下拉菜单
- [x] Header 用户下拉菜单
- [x] Header 移动端菜单完整 i18n
- [x] Footer 所有文本

### P1 — Landing Page 核心 (~100 strings) ✅
- [x] Hero section (unified-hero.tsx) — 主版本
- [x] Pricing section (pricing.tsx)
- [x] Modules section (modules.tsx)
- [x] Stats section (stats.tsx)
- [x] Instructor section (instructor-section.tsx)
- [x] Testimonials section (testimonials.tsx)
- [x] Newsletter section (newsletter.tsx)

### P2 — FAQ + 其余内容段 (~100 strings) ✅
- [x] FAQ section (faq.tsx) — 12 general QA pairs
- [x] Research Sources (research-sources.tsx)
- [x] Future of Coding (future-of-coding.tsx)
- [x] Discord Community (discord-community-section.tsx)
- [x] Newsletter Form (newsletter-form.tsx)
- [x] Early Access Hero (unified-hero.tsx 的第二套 UI) — 延后
- [x] Early Access FAQ (faq.tsx isEarlyAccess block) — 延后

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

### P3c — 剩余公开页面 (~120 strings) ✅
- [x] Members 页面 (members.tsx)
- [x] Community 页面 (community.tsx)
- [x] Profile 页面 (profile/edit.tsx, profile/$userId.tsx)
- [x] Blog 公开页 (blog/index.tsx, blog/$slug.tsx)
- [x] News 公开页 (news.tsx)
- [x] Agents 公开页 (agents/index.tsx, agents/new.tsx, agents/$slug.tsx)
- [x] Agent Form (agent-form.tsx)
- [x] Launch Kits 公开页 (launch-kits/)
- [x] Unsubscribe 页面 (unsubscribe.tsx)
- [x] Create Testimonial (create-testimonial.tsx)
- [x] Dev Login (dev-login.tsx)
- [x] About / Login 存根页
- [x] Early Access Hero + FAQ（延后）

### P3d — Admin 后台 (~680 strings) ✅
- [x] Admin layout + nav (admin-nav.tsx)
- [x] Analytics, UTM Analytics, Conversions (3 个路由 + 子页面)
- [x] User Management (comments, users 列表 + 详情, affiliates)
- [x] Content Management (blog, news, launch-kits CRUD)
- [x] Email 系统 (emails/ 路由 + 子组件)
- [x] Settings (feature-flag-card, targeting-dialog)
- [x] Video Processing / Vectorization
- [x] Vector Search / Chat

### P3e — 法律页面 (~175 strings, 特殊处理) ✅
- [x] Privacy Policy (privacy-policy.tsx)
- [x] Terms of Service (terms-of-service.tsx)
- [x] Refund Policy (refund-policy.tsx)

## Phase 3 — 语言切换器 + SEO ✅
- [x] <link rel="alternate" hreflang="x" /> 支持
- [x] sitemap.xml 多语言
- [x] <meta og:locale> 标签

## Phase 3.5 — URL 路径前缀 ✅
- [x] router.rewrite 适配层 (input/output)
- [x] SeoHreflangLinks 改为 /zh/ 路径前缀
- [x] sitemap.ts hreflang 改为路径前缀
- [x] LanguageSwitcher 切换后同步 URL
- [x] 内部路由排除 (admin/learn/api)
- [x] DB 连接池超时优化
- [x] 清理未使用代码 (server.ts detectLocaleFromRequest)
- [x] window.location.href → navigate() (unsubscribe, dev-login)

## Phase 4 — 字幕多语言 🔥（预处理 | 最高 ROI）
### 设计原则
- 预处理：视频上传 → Whisper 转录 → GPT 翻译 → 存 VTT → 完成
- 管理员可选人工校对（机翻做第一版，人工做精校版）
- SRT 不考虑：项目用 react-player（原生 `<video>`），VTT 零依赖

### 4.0 扩展 Whisper 响应格式
- [x] `src/utils/openai.ts` `transcribeSingleAudioChunk()`：
  `response_format: "text"` → `"verbose_json"`（获得带时间戳的 segments）
- [x] 返回格式：`{ segments: [{ start: 0.0, end: 3.5, text: "..." }] }`
- [x] 拼接多段音频的 segments，调整时间偏移

### 4.1 生成 VTT 文件
- [x] 新建 `src/utils/vtt.ts`：segments → VTT 字符串
- [x] en/zh/zh-TW 各生成一份 `.vtt`，上传 R2
- [x] `segments` 表加 `vtt_keys JSONB DEFAULT '{}'`
  存储 `{"en": "xxx_en.vtt", "zh": "xxx_zh.vtt", "zh-TW": "xxx_zh_tw.vtt"}`

### 4.2 GPT 翻译保留时间戳
- [x] 新建 `translateTranscriptSegments()`：输入 `[{start,end,text}]`，输出同结构翻译
- [x] 集成到 `processTranscriptJob()` worker 管线：
  Whisper → 生成 en.vtt → GPT 翻译 → 生成 zh.vtt / zh-TW.vtt → 存 R2

### 4.3 VideoPlayer 字幕集成
- [x] `video-player.tsx`：根据 segment.vtt_keys 动态生成 `<track>` 元素
- [x] 字幕语言选择器：「中文」「English」「繁體中文」
- [x] 默认字幕 = 当前 UI locale
- [ ] 手动上传 VTT 兜底（admin 后台）

### 4.4 Transcripts Tab（当前保持）
- [x] 纯文本仍从 `segments.transcripts` 读取（现有行为不变）
- [ ] 后续 Phase 5 做多语言 Transcripts tab

### 4.5 生产稳定性加固 ✅ (2026-06-26)
- [x] Whisper 转录加重试逻辑：5xx/429 自动重试 3 次，指数退避 2s/4s/8s
- [x] 多音频块并行转录（Promise.all），结果按 index 排序
- [x] MAX_AUDIO_CHUNK_SIZE 20MB → 12MB，降低 500 错误概率
- [x] 字幕翻译 prompt 修复：对齐 `response_format: json_object`
- [x] 翻译结果逐项校验 start/end/text 类型，畸形输出精确报错
- [x] zh/zh-TW 翻译并行执行（Promise.allSettled），locale 错误日志标识
- [x] 字幕 URL 获取容错：单个 locale 失败不影响其他
- [x] MutationObserver 注入前检查 track 是否已存在
- [x] DB 连接池：删除 `process.exit(-1)` 防止 Neon 空闲超时崩溃
- [x] Windows 缩略图：用 ffmpeg 替代 ImageMagick `convert` 命令

### 成本估算
- Whisper：~$0.006/分钟
- GPT 翻译：~$0.003/千字 × 2 语言
- 30 分钟视频 ≈ $0.30/集

---

## Phase 5 — 内容模型国际化 🔮（预处理 | locale 列方案）
### 设计原则
- Strapi 模式：locale 列 + `translation_of` 自引用
- `(slug, locale)` 联合唯一约束
- slug 不翻译（行业共识）
- 非文本字段（image、timestamps、flags）不翻译
- 缺失 locale 时 fallback 到 en

### 5.0 课程元数据
- [ ] `modules` + locale 列（title）
- [ ] `segments` + locale 列（title, content, summary）
- [ ] `(slug, locale)` UNIQUE，`translation_of` 自引用
- [ ] data-access 查询加 locale 参数 + fallback
- [ ] Admin 编辑表单加语言 Tab

### 5.1 公开内容
- [ ] `blog_posts` + locale 列（title, content, excerpt）
- [ ] `agents` + locale 列（name, description, content）
- [ ] `news_entries` + locale 列（title, description）
- [ ] `launch_kits` + locale 列（name, description, longDescription）
- [ ] Admin CRUD 统一支持语言切换

### 5.2 邮件模板
- [ ] 不同语言用不同 key（如 `waitlist_welcome_en` / `waitlist_welcome_zh`）
- [ ] 不改 schema，新增加键即可

---

## Phase 6 — 向量搜索多语言 🔮（预处理 | 依赖 Phase 5）
- [ ] `transcript_chunks` 加 locale 列
- [ ] 每语言独立 vectorize（先删旧 chunks，再按 locale 重新 chunk + embed）
- [ ] 搜索：`WHERE locale = $currentLocale` + pgvector cos 距离
- [ ] 可选降级：搜不到中文时跨语言搜索 `WHERE locale IN ('zh', 'en')`

---

## Phase 7 — 评论区按需翻译 🔥（实时 | 不存储） ✅ (2026-06-26)
### 设计原则
- 评论是用户生成内容，语言混合，不预处理
- Twitter/YouTube 模式：显示原文 + "翻译"按钮
- 点击调用 GPT 翻译 → 单次展示 → 不存数据库

### 实施
- [x] `src/fn/comments.ts` `translateCommentFn`：POST，认证用户，GPT-4o-mini 翻译
- [x] `CommentItem` 加 `TranslateButton`（Languages/ArrowLeftRight 图标，装载中 Loader2）
- [x] 翻译结果仅存在组件 state，不落库
- [x] 自动检测目标语言（当前 UI locale → 语言名称）
- [x] i18n keys：translate/translating/showOriginal/translateFailed/translatedFrom (en/zh/zh-TW)

---

## Phase 8 — RTL 支撑（后续）
- [ ] 关键 CSS 物理方向 → 逻辑属性
- [ ] Tailwind rtl: variant 启用
- [ ] E2E 测试多语言
