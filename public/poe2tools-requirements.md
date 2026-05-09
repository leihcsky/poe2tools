# POE2Tools 需求文档

> 版本：v1.0 | 创建日期：2026-05-09 | 状态：进行中

---

## 一、项目说明

### 1.1 项目背景

Path of Exile 2（POE2）是目前市场上机制最复杂的 ARPG 游戏之一，拥有庞大的全球玩家群体。2026 年 5 月 29 日，官方将发布迄今为止最大规模的版本更新——**0.5「Return of the Ancients」**，引入全新的 Runes of Aldur 联赛机制、超过 100 种新符文、完整的终局系统重做以及两个全新晋升职业。

新版本带来大量新机制，玩家对攻略和工具的需求将在版本上线前后迎来搜索高峰，而现有工具站尚未覆盖这些新机制，存在明显的市场缺口。

### 1.2 项目定位

**POE2Tools** 是一个面向 Path of Exile 2 玩家的**垂直工具站**，提供游戏内高频决策场景的在线计算工具、游戏数据速查库和版本攻略内容，通过 Google AdSense 实现流量变现。

### 1.3 目标用户

- **新玩家**：0.5 版本吸引的入坑用户，需要基础机制说明和新手引导
- **普通玩家**：每个版本都活跃的核心玩家，需要符文组合速查、Ward 计算等工具
- **重度玩家**：需要制作模拟、货币兑换追踪等进阶工具

### 1.4 变现方式

- Google AdSense 展示广告（工具页侧边栏 + 数据库页文中）
- 后期可扩展：联盟营销、赞助内容

### 1.5 上线时间目标

| 节点 | 时间 | 目标 |
|------|------|------|
| 站点上线 + 第一个工具 | 2026-05-12 | 开始被 Google 索引 |
| Patch Notes 数据填充 | 2026-05-21 后 48h 内 | 成为最快更新 0.5 数据的工具站 |
| 流量承接 | 2026-05-29 | 版本上线时工具可用，承接搜索高峰 |
| 持续扩展 | 2026-06 起 | 扩展工具数量，积累站点权重 |

---

## 二、技术架构

### 2.1 技术选型

| 层级 | 技术 | 选型原因 |
|------|------|----------|
| 框架 | Next.js 14 (App Router) | 全栈、SSG/SSR/CSR 按需混用、Vercel 原生支持 |
| 样式 | Tailwind CSS | 开发速度快，AI 辅助友好 |
| 数据库 | Supabase | 免费额度足够，自带 REST API |
| 部署 | Vercel | Next.js 最佳拍档，自动 CI/CD，全球 CDN |
| 缓存 | Vercel KV（Redis） | 工具计算结果缓存，免费额度够用 |
| 语言 | TypeScript | 类型安全，减少运行时错误 |

### 2.2 渲染策略

| 页面类型 | 渲染方式 | 原因 |
|----------|----------|------|
| 工具落地页（整体） | SSG | Google 完整抓取静态内容区 |
| 工具交互组件 | CSR（孤岛） | 实时交互需要客户端 JS |
| 攻略指南页 | SSG | 静态内容，索引速度最快 |
| 数据库详情页 | SSG + ISR | Patch 更新后自动重新生成，无需重新部署 |
| 首页 | SSR | 展示最新版本信息，保证数据实时性 |

> **核心原则**：能 SSG 就 SSG。工具页采用「静态内容壳 + CSR 交互孤岛」的 Islands Architecture，既保证 SEO 效果，又不牺牲交互体验。

### 2.3 数据存储策略

```
JSON 文件（/data/*.json）
  └─ 游戏静态数据：符文属性、宝石数据、独特装备
  └─ 构建时读取，生成纯静态页面，零数据库费用

Supabase
  └─ 用户动态数据：保存的 Build 配置、收藏的符文组合

Vercel KV
  └─ 热点查询缓存、工具计算结果缓存，响应时间 <50ms
```

### 2.4 数据更新流程（Patch Notes 发布时）

```
1. 用 AI 解析 Patch Notes → 生成结构化 JSON
2. 替换 /data/runes.json 等数据文件
3. git push 触发 Vercel 重新部署
4. 调用 /api/revalidate 批量触发 ISR 重新生成数据库页
```

---

## 三、项目结构

```
poe2tools/
├── app/
│   ├── page.tsx                        # 首页（SSR）
│   ├── layout.tsx                      # 全局布局，AdSense 脚本
│   ├── tools/
│   │   ├── rune-combinations/
│   │   │   └── page.tsx                # 符文组合速查器（SSG + CSR 孤岛）
│   │   ├── runic-ward-calc/
│   │   │   └── page.tsx                # Runic Ward 计算器
│   │   └── verisium-craft/
│   │       └── page.tsx                # Verisium 制作模拟器
│   ├── guides/
│   │   └── [slug]/
│   │       └── page.tsx                # 攻略指南（SSG）
│   ├── db/
│   │   ├── runes/
│   │   │   └── [slug]/page.tsx         # 符文数据库（SSG + ISR）
│   │   ├── gems/
│   │   │   └── [slug]/page.tsx         # 宝石数据库
│   │   └── uniques/
│   │       └── [slug]/page.tsx         # 独特装备数据库
│   └── api/
│       ├── tools/
│       │   └── runes/route.ts          # 符文组合计算 API
│       ├── db/
│       │   └── [type]/route.ts         # 数据查询 API（带 KV 缓存）
│       └── revalidate/
│           └── route.ts                # ISR 批量触发接口
├── components/
│   ├── tools/                          # 工具交互组件（'use client'）
│   │   ├── RuneCalculatorWidget.tsx
│   │   ├── WardCalculatorWidget.tsx
│   │   └── CraftingSimWidget.tsx
│   ├── db/                             # 数据库页展示组件
│   ├── ui/                             # 通用 UI 组件（Button、Badge 等）
│   └── layout/                         # 导航、页脚、广告位组件
├── data/
│   ├── runes.json                      # 符文静态数据
│   ├── gems.json                       # 宝石静态数据
│   └── uniques.json                    # 独特装备静态数据
├── content/
│   └── guides/                         # MDX 格式攻略文章
├── lib/
│   ├── rune-calculator.ts              # 符文组合核心计算逻辑
│   ├── ward-calculator.ts              # Ward 计算逻辑
│   ├── supabase.ts                     # Supabase 客户端
│   └── kv.ts                           # Vercel KV 缓存工具函数
├── next-sitemap.config.js              # 自动生成 sitemap.xml
└── next.config.js
```

---

## 四、功能需求

### 4.1 工具功能

#### 4.1.1 符文组合速查器（第一优先级，5月12日上线）

**页面路由**：`/tools/rune-combinations`

**功能描述**：

- 左侧展示所有可用符文列表，支持按类型/等级筛选
- 用户勾选当前拥有的符文（最多 8 个，对应终局符文槽数量）
- 右侧实时展示当前组合的效果说明、怪物难度影响、推荐度评级
- 支持「最优组合推荐」——输入目标（刷图效率 / 高价值掉落 / 挑战内容），输出推荐组合

**SEO 内容区（静态渲染）**：

- H1：`POE2 Rune Combinations Calculator — Path of Exile 2 Runes of Aldur Guide`
- 工具功能说明（200字）
- 使用步骤说明（3步）
- 符文机制完整解析（500字）
- FAQ（至少 5 个问题，覆盖长尾搜索词）

**核心关键词**：

```
poe2 rune combinations guide
poe2 runes of aldur best combinations
path of exile 2 remnant rune calculator
poe2 rune tier list
```

**数据结构**（`/data/runes.json`）：

```json
[
  {
    "id": "rune_001",
    "name": "Rune of Fire",
    "effect": "Monsters deal 20% increased Fire Damage",
    "reward": "Increased Ember drops",
    "tier": 1,
    "tags": ["elemental", "fire"],
    "difficulty_modifier": 1.2
  }
]
```

---

#### 4.1.2 Runic Ward 计算器（第一优先级，5月29日上线）

**页面路由**：`/tools/runic-ward-calc`

**功能描述**：

- 输入角色装备的 Ward 相关属性（基础 Ward 值、Ward 恢复速率、减伤系数）
- 计算总 Ward 值、有效生命值（EHP）、Ward 恢复时间
- 对比不同属性投入的收益曲线，帮助玩家判断「叠多少 Ward 才够」
- 提供推荐的 Ward 阈值参考（对应不同游戏内容的难度）

**核心关键词**：

```
poe2 runic ward calculator
poe2 ward build how much ward do i need
poe2 runic ward explained
```

---

#### 4.1.3 Verisium 制作模拟器（第二优先级，6月上线）

**页面路由**：`/tools/verisium-craft`

**功能描述**：

- 选择装备基础类型和目标词缀
- 模拟不同 Verisium 制作路径的期望消耗
- 显示各路径的成功概率分布和平均成本对比
- 支持「预算模式」——输入可用 Verisium 数量，推荐性价比最高的制作路径

**核心关键词**：

```
poe2 verisium crafting calculator
poe2 verisium how to get
poe2 alloy crafting guide
```

---

#### 4.1.4 Atlas Ascendancy 规划器（第二优先级，6月上线）

**页面路由**：`/tools/atlas-planner`

**功能描述**：

- 可视化展示 400+ 节点的新版 Atlas 被动树
- 支持点击选择节点、模拟不同天赋路线
- 显示当前选择的总点数消耗和各项加成汇总
- 提供热门天赋路线预设（刷图效率型 / 高价值掉落型 / Boss 挑战型）

**核心关键词**：

```
poe2 atlas tree planner 0.5
poe2 atlas ascendancy guide
poe2 atlas passive tree best nodes
```

---

### 4.2 数据库功能

#### 4.2.1 符文数据库

**页面路由**：`/db/runes/[slug]`

**每个符文独立页面包含**：

- 符文名称、图标、效果描述
- 难度影响说明
- 推荐搭配组合
- 获取方式
- 相关符文推荐（内链）

**批量生成**：patch notes 发布后，通过 `generateStaticParams` 从 `runes.json` 批量生成 100+ 个静态页面，每页 URL 格式为 `/db/runes/rune-of-fire`。

> **SEO 价值**：100+ 个独立页面 = 100+ 个可被索引的长尾关键词落地页，是工具站获取长尾流量的核心机制。

#### 4.2.2 技能宝石数据库

**页面路由**：`/db/gems/[slug]`

覆盖 0.5 版本新增的 17+ 个 Kalguuran 技能宝石，每个宝石独立页面，包含属性详情、推荐 Build、相关词缀说明。

#### 4.2.3 独特装备数据库

**页面路由**：`/db/uniques/[slug]`

收录 0.5 版本新增独特装备，每件装备独立页面，包含属性列表、使用场景、获取方式。

---

### 4.3 内容功能（攻略指南）

#### 上线前发布（5月8–12日）

| 文章标题 | 目标关键词 | 目的 |
|----------|------------|------|
| POE2 0.5 版本完全预览：新玩家入坑指南 | poe2 0.5 beginners guide | 承接版本前预研流量 |
| Runes of Aldur 机制提前解析 | poe2 runes of aldur explained | 0.5 新机制词，近零竞争 |
| 0.5 版本前应该做哪些准备 | poe2 0.5 what to prepare | 承接老玩家回流搜索 |

#### Patch Notes 发布后（5月21日后48小时内）

| 文章标题 | 目标关键词 |
|----------|------------|
| POE2 0.5 完整改动解读 | poe2 0.5 patch notes |
| Runic Ward 机制完全解析 | poe2 runic ward guide |
| 0.5 开荒 Build 推荐 | poe2 0.5 league starter build |

#### 版本上线后（5月29日后）

| 文章标题 | 目标关键词 |
|----------|------------|
| Verisium 高效获取方法 | poe2 verisium farming guide |
| 新手到终局完整路线图 | poe2 endgame progression guide |
| 0.5 货币经济入门 | poe2 currency farming guide 0.5 |

---

### 4.4 SEO 技术需求

| 需求项 | 实现方式 | 优先级 |
|--------|----------|--------|
| 自动生成 sitemap.xml | next-sitemap，每次构建自动生成 | 上线前必须 |
| 动态 Meta 标签 | 每个页面 `generateMetadata()`，包含核心关键词 | 上线前必须 |
| JSON-LD 结构化数据 | 工具页用 SoftwareApplication schema，指南页用 Article schema | 上线前必须 |
| robots.txt | next-sitemap 自动生成 | 上线前必须 |
| Google Search Console | 上线当天提交 sitemap，手动请求索引核心页 | 上线当天 |
| Core Web Vitals | SSG 静态页面保证 LCP < 2.5s，工具交互组件懒加载 | 上线前 |
| 内链结构 | 工具页 ↔ 数据库页 ↔ 指南页 相互内链，增强主题权重 | 持续维护 |

---

### 4.5 AdSense 广告位规划

| 位置 | 广告类型 | 说明 |
|------|----------|------|
| 工具页侧边栏 | 展示广告 | 不遮挡工具核心操作区 |
| 数据库详情页文中 | 原生广告 | 放在内容中段，不影响阅读 |
| 指南页文中 | 展示广告 | 每 800 字左右插入一个 |
| 首页底部 | 展示广告 | 低干扰位置 |

> AdSense 审核需要 3–7 天，建议站点上线后立即申请，不要等内容完善后再申请。

---

## 五、关键词策略

### 5.1 核心种子词分类

| 类型 | 词 | KD预估 | 优先级 |
|------|-----|--------|--------|
| 0.5新版本词 | poe2 runes of aldur guide | 低 | 🚀 本周发 |
| 0.5新版本词 | poe2 runic ward explained | 低 | 🚀 本周发 |
| 0.5新版本词 | poe2 verisium how to get | 低 | 🚀 本周发 |
| 0.5新版本词 | poe2 martial artist build guide | 低 | 🚀 本周发 |
| Build词 | poe2 best league starter build 0.5 | 中 | 📅 本月发 |
| Build词 | poe2 deadeye lightning arrow build | 中 | 📅 本月发 |
| 新手词 | path of exile 2 beginners guide 2026 | 中 | 📅 本月发 |
| 新手词 | poe2 how to get skill gems | 低 | 📅 本月发 |
| 经济词 | poe2 currency farming guide 0.5 | 中 | 📅 本月发 |
| 工具词 | poe2 rune combination calculator | 低 | 工具页承接 |
| 工具词 | poe2 runic ward calculator | 低 | 工具页承接 |

### 5.2 竞品参考

| 竞品站 | 强项 | 弱项（我们的机会） |
|--------|------|-------------------|
| Maxroll | 内容质量高，品牌强 | 0.5 新机制工具更新慢 |
| Mobalytics | Build 规划器完善 | 符文组合工具空白 |
| poe.ninja | 经济数据权威 | 攻略内容几乎没有 |
| CraftOfExile | 制作计算专业 | 仅覆盖制作场景，新机制慢 |

---

## 六、开发阶段规划

### 阶段一：MVP 上线（现在 — 5月12日）

- [ ] 注册域名（推荐 poe2tools.gg）
- [ ] 初始化 Next.js 14 项目
- [ ] 搭建完整目录结构
- [ ] 完成符文速查器页面（假数据占位）
- [ ] 完成首页和导航
- [ ] 配置 next-sitemap、Meta 标签、JSON-LD
- [ ] 部署到 Vercel，绑定自定义域名
- [ ] 提交 Google Search Console，手动请求索引
- [ ] 发布 3 篇上线前预热文章
- [ ] 申请 AdSense

### 阶段二：数据冲刺（5月21–23日）

- [ ] 用 AI 解析 Patch Notes，生成 runes.json / gems.json
- [ ] 批量生成 100+ 个符文数据库页面
- [ ] 更新符文速查器真实数据
- [ ] 发布《0.5 完整改动解读》文章
- [ ] 触发全站 ISR 重新生成
- [ ] 在 Reddit r/PathOfExile2 发帖推广

### 阶段三：版本上线承接（5月29日 — 6月）

- [ ] 用真实游戏数据修正工具细节
- [ ] 上线 Runic Ward 计算器
- [ ] 发布版本上线后系列文章
- [ ] 根据 GSC 数据优化排名 4–15 的词
- [ ] 开发 Verisium 制作模拟器

### 阶段四：持续扩展（6月起）

- [ ] 上线 Atlas Ascendancy 规划器
- [ ] 接入 poe.ninja 货币汇率数据
- [ ] 开发 Build 伤害快速估算器
- [ ] 建立词库更新 SOP，跟踪每次 patch 的新词机会
- [ ] 为年底 1.0 正式版流量高峰做内容储备

---

## 七、初始化命令参考

### 创建项目

```bash
npx create-next-app@latest poe2tools --typescript --tailwind --app --no-src-dir
cd poe2tools
npm install @supabase/supabase-js @vercel/kv next-sitemap next-seo
```

### 生成目录结构（bash 环境）

```bash
mkdir -p \
  app/tools/rune-combinations \
  app/tools/runic-ward-calc \
  app/tools/verisium-craft \
  app/guides \
  app/db/runes \
  app/db/gems \
  app/db/uniques \
  app/api/tools/runes \
  app/api/db \
  app/api/revalidate \
  components/tools \
  components/db \
  components/ui \
  components/layout \
  data \
  content/guides \
  lib

touch data/runes.json data/gems.json data/uniques.json
```

### next-sitemap 配置

```js
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://your-domain.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
}
```

### Patch Notes 数据解析 Prompt

```
以下是 POE2 0.5 patch notes 全文，请按照这个 JSON 格式提取所有符文数据：
{"id":"","name":"","effect":"","tier":1,"tags":[],"difficulty_modifier":1.0}
只输出 JSON 数组，不要任何其他内容。

[粘贴 patch notes 全文]
```

### ISR 触发命令

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"paths":["/db/runes"]}'
```

---

*文档持续更新，以实际开发进展为准。*
