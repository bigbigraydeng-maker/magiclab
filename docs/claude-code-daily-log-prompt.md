# Claude Code / Codex 每日日报生成提示词

> 版本：v1.0 | 日期：2026-05-21 | 用途：给 Claude Code / Codex 使用，生成供 Magic Content Engine 消费的每日工作素材

## 触发条件

当用户说：

> 今天结束了

或语义等价表达，例如“今天到此为止”“今天就这样”，立即生成一份当天的 Claude Code / Codex 日报文件。

## 文件保存位置

固定保存到：

```text
Second-Brain/Claude-Code-Logs/
```

文件名格式：

```text
claude-code-YYYY-MM-DD-{project-slug}.md
```

说明：

- `YYYY-MM-DD` 使用 `Australia/Brisbane` 时区当天日期。
- `{project-slug}` 必须从下面项目枚举里选择。
- 如果一天涉及多个项目，每个项目生成一份独立日报，不要合并。

## 项目枚举

| 项目正式名 | 文件名 slug |
| --- | --- |
| Magiclab | magiclab |
| ChinaTravel | chinatravel |
| StockQueen | stockqueen |
| YellowBook | yellowbook |
| AUCompass | aucompass |
| CarScout | carscout |
| Movehub | movehub |
| BizMate | bizmate |

## 输出格式

请严格按照下面结构输出，全部使用中文：

```markdown
---
date: YYYY-MM-DD
timezone: Australia/Brisbane
project: 项目正式名
source: Claude Code / Codex
privacy: internal
content_ready: true
---

# 今日 Claude Code 记录

## 1. 今日目标
今天主要想完成什么？用 1-3 句话说明。

## 2. 实际完成
- 做了什么功能
- 改了哪些页面/模块
- 跑了哪些测试或验证

## 3. 关键产品决策
- 为什么这样做
- 放弃了什么
- 这次取舍背后的判断

## 4. 遇到的问题
- bug
- 技术限制
- 产品不确定性
- 后面要补的东西

## 5. 可以转成内容的素材

### 素材 1
- **类型**：founder insight / builder 过程 / 产品判断 / 短观点
- **一句话钩子**：不超过 25 字，要有钩子感
- **展开说明**：2-4 句话，把钩子讲清楚
- **适合平台**：LinkedIn / X / Threads / 小红书
- **隐私风险**：无 / 低 / 中 / 高

### 素材 2
- **类型**：
- **一句话钩子**：
- **展开说明**：
- **适合平台**：
- **隐私风险**：

### 素材 3
- **类型**：
- **一句话钩子**：
- **展开说明**：
- **适合平台**：
- **隐私风险**：

## 6. 不能公开的内容
- 客户名
- 私人信息
- 商业机密
- 不想外发的细节
- 第 5 节中“隐私风险=高”的素材原文

## 7. 相关链接
- GitHub commit:
- PR:
- issue:
- 本地文件:
```

## frontmatter 字段说明

- `date`：当天日期，格式为 `YYYY-MM-DD`。
- `timezone`：固定为 `Australia/Brisbane`。
- `project`：项目正式名，必须来自项目枚举。
- `source`：固定为 `Claude Code / Codex`。
- `privacy`：固定为 `internal`。
- `content_ready`：
  - `true`：日报结构完整，第 5 节素材足够，Magic Content Engine 可以直接消费。
  - `false`：临时记录，缺素材或缺决策说明，不要交给 Magic Content Engine。

## 写作要求

1. 全部使用中文。
2. 不要只写流水账。每条“实际完成”后面最好能对应一条决策、问题或内容素材。
3. 第 5 节“可以转成内容的素材”至少 3 条，每条必须有“隐私风险”字段。
4. 涉及客户名、私人信息、商业机密的内容，只能进入第 6 节，禁止出现在第 5 节。
5. 没有链接就写“无”，不要编造 URL。
6. 如果一天没有足够内容，或不确定是否适合输出，把 `content_ready` 设为 `false`。

## Magic Content Engine 对接约定

Magic Content Engine 抓取这个目录时：

- 只读取 `content_ready: true` 的文件。
- 主要消费第 5 节结构化素材卡。
- 自动跳过第 6 节不能公开的内容。
- 使用 `project` 字段做项目维度分组。

## 当前状态

- 触发词：`今天结束了`
- 定时触发：暂不启用
- 生效日期：2026-05-21
