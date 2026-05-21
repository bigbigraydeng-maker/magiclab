# Magic Content Engine 产品需求文档

> 版本：v0.1 草稿 | 日期：2026-05-21 | 负责人：Magic Lab

## 1. 产品定位

Magic Content Engine 是 Magic Engine 里的 AI 内容员工。它从用户真实的数字生活中学习，把邮件、主动投喂的图片/音频/视频、AI 编程记录、GitHub 记录等素材，转化成每周可发布的中文社媒内容包。

它不是普通的 AI 文案生成器。它的核心价值是：

- 从真实素材中发现内容，而不是从空白 prompt 里硬写。
- 建立长期的 Content DNA，持续学习用户的表达风格、内容边界、主题偏好和平台策略。
- 每周为小红书、LinkedIn、Threads、X、Facebook、Instagram 生成平台适配的中文内容。
- 通过用户反馈不断提升，下一次更像用户、更懂平台、更懂隐私边界。

核心承诺：

> 每周自动从用户真实的工作和生活记录里，发现值得表达的内容，并用越来越像用户本人的方式，生成适合不同平台的中文社媒草稿。

## 2. 目标用户

第一阶段的核心用户：

- 创始人、builder、顾问、创作者，脑子里有很多想法，但很难稳定输出内容。
- 同时面对中文市场和国际市场。
- 第一阶段希望以中文内容为主，覆盖多个社交平台。
- 高价值素材散落在邮件、AI 对话、代码记录、GitHub、图片、音频、视频和日常灵感里。

未来客户群体：

- Magic Engine 客户，希望让创始人、品牌或团队持续发布内容，但又不想单独雇完整内容团队。

## 3. 每周发布目标

产品每周应生成一套中文内容包，覆盖以下平台：

| 平台 | 语言 | 内容角色 |
| --- | --- | --- |
| 小红书 | 中文 | 个人故事、生活化表达、情绪共鸣、图文内容 |
| LinkedIn | 中文 | 专业观点、创始人思考、builder 可信度 |
| Threads | 中文 | 短观点、连续想法、轻讨论 |
| X | 中文 | 更 sharp 的短观察、build in public 记录 |
| Facebook | 中文 | 更个人、更关系型的状态更新 |
| Instagram | 中文 | 图片优先的 caption、短反思、轻 CTA |

建议每周输出：

- 3 个核心内容主题。
- 2 篇小红书笔记。
- 2 条 LinkedIn 中文内容。
- 3-5 条 Threads 中文内容。
- 3-5 条 X 中文内容。
- 2 条 Facebook 中文动态。
- 2-3 条 Instagram 中文 caption。
- 1 份建议发布时间表。
- 每条草稿都附带来源追踪和隐私风险提醒。

## 4. 素材来源

### P0 素材源

- 手动投喂入口：文字、截图、图片、音频、视频、链接。
- 邮件片段，后续再接 Gmail / Outlook。
- AI 对话摘录。
- Claude Code / Codex session 总结。
- Claude Code / Codex 每日日报，固定来自 `Second-Brain/Claude-Code-Logs/`，格式见 `docs/claude-code-daily-log-prompt.md`。
- GitHub commit、PR、issue、release note、debug note。

### P1 素材源

- Gmail / Outlook 直接连接。
- GitHub connector，自动生成每周开发总结。
- 音频和视频自动转写。
- 对用户主动投喂的图片做理解和摘要。

### P2 素材源

- 用户授权选择的相册、相簿或日期范围。
- 微信截图、转发文本或手动导出的聊天片段。
- 社媒表现数据回流。
- 日历和会议记录。

## 5. 核心工作流

```text
真实数字素材
  -> 素材摄取
  -> 来源标准化
  -> 隐私和敏感信息扫描
  -> 打标签和评分
  -> 更新 Content DNA
  -> 每周发现内容机会
  -> 按平台生成草稿
  -> 人工确认和修改
  -> 捕捉反馈
  -> 下一轮自动改进
```

## 6. 产品模块

### Magic Inbox

用户可以把所有原始素材投喂到一个入口：

- 文字灵感。
- 邮件片段。
- 截图。
- 图片。
- 音频。
- 视频。
- 链接。
- AI 对话片段。
- 代码 session 总结。
- GitHub 链接。

图片和截图素材需要尽量附带一段场景说明，建议包含：

- 这张图发生在什么场景。
- 图里哪些元素可以公开，哪些不能公开。
- 这张图背后想表达的观点或情绪。
- 是否涉及客户、家人、地址、合同、后台数据等敏感内容。
- 适合的平台：小红书、Instagram、Facebook、LinkedIn、X、Threads。

每条素材进入系统后，会被标准化为一条 source record，包含：

- 来源类型。
- 发生日期。
- 摘要。
- 关键实体。
- 主题标签。
- 隐私风险标记。
- 内容潜力评分。
- 推荐平台适配。

### Content DNA

系统会维护一个持续更新的用户模型：

- 用户身份和内容定位。
- 核心内容支柱。
- 写作语气和表达风格。
- 中文市场表达偏好。
- 国际市场表达注意事项。
- 偏好的文章结构和开头方式。
- 需要避免的词、主题和表达。
- 禁止暴露的人名、公司名、地点、关系和客户信息。
- 平台级偏好。
- 用户认可过的内容样例。
- 用户拒绝过的表达模式。

系统每周应生成一段 Content DNA 更新说明：

> 这一周我学到：你更喜欢从真实产品决策切入的 founder reflection，不喜欢太 polished、太 motivational 的表达。

### Opportunity Engine

系统应该先发现内容机会，再进入写作。

每个内容机会包含：

- 主题标题。
- 来源追踪。
- 为什么值得发。
- 推荐平台。
- 建议角度。
- 风险等级。
- 隐私提醒。
- 是否已经适合生成草稿。

### Platform Writing Engine

同一个主题不应该被机械翻译或复制到所有平台，而应该按平台语境重新表达。

平台规则：

- 小红书：具体生活细节、更强标题、更温暖的情绪入口、适合配图。
- LinkedIn：清晰专业观点、创始人可信度、结构化推理，避免夸张营销。
- Threads：短句、连续想法、容易引发回复的口吻。
- X：紧凑、sharp、build in public，每条只表达一个重点。
- Facebook：更个人、更关系型、更像真实状态更新。
- Instagram：图片优先，caption 简洁，轻 CTA。

### Feedback Loop

每条草稿都需要支持轻量反馈：

- 采用这条。
- 不像我。
- 太 AI。
- 太营销。
- 太浅。
- 更个人一点。
- 更专业一点。
- 更适合 LinkedIn。
- 更适合小红书。
- 永远不要提这个。
- 保存为我的风格样例。

这些反馈会更新 Content DNA 和平台偏好。

## 7. 隐私和信任要求

这个产品只有在用户感觉“被理解，但没有失控”的前提下才能成立。

v0.1 必须满足：

- 不自动发布。
- 每条生成内容必须展示来源追踪。
- 每条生成内容必须展示隐私风险提醒。
- 生成草稿前必须识别敏感实体。
- 用户可以设置永远不能使用的人名、公司、客户、家庭细节和地点。
- 私密素材可以用于理解用户，但不能被直接引用到发布文案里。
- 使用客户或项目故事时，默认匿名化。
- 用户必须能删除一条素材以及由它衍生出的内容。

风险等级：

- 低风险：公开信息、泛化观点、无敏感名字。
- 中风险：工作场景、客户类别、个人故事，但没有直接标识。
- 高风险：姓名、客户细节、家庭信息、法律/金融/医疗主题、私人图片。

## 8. 数据模型草案

### content_sources

- id
- user_id
- source_type
- source_title
- source_uri
- raw_text
- extracted_text
- summary
- occurred_at
- tags
- entities
- privacy_flags
- content_score
- created_at

### content_dna_profiles

- id
- user_id
- positioning
- content_pillars
- voice_traits
- platform_preferences
- privacy_rules
- approved_examples
- rejected_patterns
- updated_at

### content_opportunities

- id
- user_id
- week_start
- title
- source_ids
- angle
- recommended_platforms
- why_now
- risk_level
- privacy_notes
- status
- created_at

### content_drafts

- id
- opportunity_id
- platform
- language
- title
- body
- visual_brief
- source_trace
- privacy_flags
- status
- created_at
- updated_at

### content_feedback

- id
- draft_id
- user_id
- feedback_type
- note
- created_at

## 9. AI Agent 设计

### Ingestion Agent

负责把原始素材标准化为结构化摘要、标签、实体和隐私标记。

### Memory Agent

根据用户采用、拒绝、编辑和显式偏好，更新 Content DNA。

### Opportunity Agent

从一周素材里发现内容机会，并按照真实性、有用性、时效性和平台适配度排序。

### Privacy Agent

在内容进入可发布状态前，检查敏感信息和潜在隐私风险。

### Platform Writer Agent

基于已经筛选过的内容机会，生成平台原生的中文草稿。

### Reflection Agent

每周生成“我对你表达风格的新理解”，并建议更新 Content DNA。

## 10. v0.1 范围

第一版先做：

- Magic Content Engine 内部原型页面。
- Magic Inbox 概念和素材类型展示。
- Weekly Content Pack 预览。
- Content DNA 预览。
- 隐私风险模型。
- 反馈动作设计。
- PRD 和架构说明。

暂时不做：

- 自动发布社媒。
- 完整 connector 授权。
- 直接读取微信。
- 全量相册接入。
- 社媒表现数据回流。

## 11. 成功指标

前 4 周验证指标：

- 用户至少采用或轻度修改 50% 的每周草稿。
- 每周至少发布 2 条内容。
- 用户每周至少给出 5 个反馈信号。
- 到第 4 周，“不像我”的反馈比例下降。
- 没有高风险隐私细节进入可发布草稿。

定性成功标准：

- 用户说：“这听起来像我。”
- 用户说：“这个素材我本来不会想起来还能发。”
- 用户说：“它让我不用再从空白页面开始。”

## 12. 下一步开发计划

1. 创建内部原型页面。
2. 定义 v0.1 的 Supabase 数据表。
3. 增加手动素材提交入口。
4. 增加模拟版每周内容包生成器。
5. 增加反馈捕捉和 Content DNA 更新规则。
6. 增加 Claude Code / Codex 每日日报解析器，只读取 `content_ready: true` 的日报文件。
7. 后续连接 Gmail / Outlook 和 GitHub。
