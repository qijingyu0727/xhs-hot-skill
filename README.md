<div align="center">

**中文** · [English](./README.en.md)

# XHS Hot Skill

#### 输入一个选题，先选 2-3 个方向，再得到完整的小红书文案与视觉包

[![License](https://img.shields.io/badge/License-MIT-111111?style=for-the-badge)](./LICENSE)
[![Scenes](https://img.shields.io/badge/Scenes-20-FF3D6E?style=for-the-badge)](#20-类内容场景)
[![Tests](https://img.shields.io/badge/Tests-74_Passing-00A86B?style=for-the-badge)](#验证)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-Compatible-315EFB?style=for-the-badge)](https://agentskills.io)

![XHS Hot Skill 效果总览](./assets/readme/overview.webp)

</div>

`xhs-hot-skill` 把一个模糊选题变成可执行内容。它先判断属于哪类场景，再给出 2-3 个真正不同的切入和视觉方向。你选定后，它才生成标题、5-9 页轮播文案、300-500 字正文、标签、互动问题、来源、风险与出图说明。

它不是“套一个爆款模板”。20 类场景各有独立配方，工具分享、旅行攻略、美妆护肤和好物测评不会再使用同一套标题与版式。

> 推荐搭配 [guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill) 使用。前者负责选题、结构和文案，后者负责将选定方案渲染为 1080×1440 图文卡片。

## 30 秒安装

```bash
npx skills add https://github.com/qijingyu0727/xhs-hot-skill --skill xhs-hot-skill -g -y
```

强烈推荐同时安装 Guizang：

```bash
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill -g -y
```

也可以直接告诉有终端权限的 Agent：

```text
帮我安装 https://github.com/qijingyu0727/xhs-hot-skill，并检查 SKILL.md、references/、data/ 和 agents/openai.yaml 是否完整。
```

## 怎么用

### 1. 给一个选题

```text
用 $xhs-hot-skill 做一期“普通人常用的 AI 搜索 Skill”。
```

Skill 会先返回 2-3 个方向。每个方向同时改变切入点、标题承诺、页面顺序、视觉系统和图片策略。

### 2. 选择方向

```text
选择 B。生成完整文案包，并搭配 guizang-social-card-skill 出图。
```

完整交付包含：

- 4-6 个标题
- 5-9 页逐页轮播文案
- 300-500 字小红书正文
- 可复制提示词、清单或决策标准
- 4-8 个标签与一个互动问题
- 素材清单、来源、版权与安全风险
- Guizang 视觉 brief；依赖可用时输出 1080×1440 图片

## 效果示例

| AI 工具 | 办公效率 | 旅行攻略 |
| --- | --- | --- |
| ![AI 工具示例](./examples/ai-tools/output/page-01.png) | ![办公效率示例](./examples/office-productivity/output/page-01.png) | ![旅行攻略示例](./examples/travel-guides/output/page-01.png) |

| 生活方式 | 好物测评 |
| --- | --- |
| ![生活方式示例](./examples/lifestyle/output/page-01.png) | ![好物测评示例](./examples/product-reviews/output/page-01.png) |

所有演示文案、图形和图片均为项目自制或明确标注的生成内容，不包含第三方小红书截图和原图。

## 20 类内容场景

| 内容组 | 场景 |
| --- | --- |
| 科技与效率 | AI 工具、数码软件、办公效率 |
| 成长与知识 | 职场求职、学习考试、读书知识 |
| 创作与出行 | 内容创作摄影、旅行攻略、本地探店 |
| 吃住与空间 | 美食食谱、家居收纳、装修租房 |
| 风格与身体 | 穿搭、美妆护肤、健身减脂、健康养生 |
| 关系与决策 | 情绪成长、亲子育儿、理财消费、好物测评 |

每个场景配方都定义了适合人群、标题公式、三类内容方向、页面结构、文案节奏、图片策略、Editorial/Swiss 路由、正反例、安全边界和检查清单。

## 工作原理

```text
一个选题
  ↓
20 类场景路由
  ↓
2-3 个内容 × 视觉方向（等待选择）
  ↓
标题 + 轮播 + 正文 + 行动工具 + 风险
  ↓
guizang-social-card-skill（可选外部依赖）
  ↓
1080×1440 图文卡片 + validator
```

日常调用只读本地风格库，不实时联网。只有明确说“更新样本库”时，Skill 才会使用 `last30days-cn` 与 `agent-reach` 检索新样本、核查后增量入库。

## 文案与视觉底线

- 文案有明确主语，短句优先，不写“在这个快速发展的时代”一类空开场。
- 正文只算正文段落，控制在 300-500 个非空白字符；标题、标签、来源和命令不计入。
- 情绪可以适度强化，可核验事实、个人体验、价格、效果和互动数字不能编。
- 健康、美妆、育儿不提供虚假或危险引导；理财不承诺收益。
- 视觉追求高对比、清楚、高级、不脏不乱。图片和信息层级优先，不堆装饰卡片。
- 真实探店、穿搭、产品实测、食谱结果不能用 AI 图冒充实拍。

## 样本库与版权

项目的研究语料只保存：公开来源 URL、公开元数据、短标签和独立归纳的内容规律。仓库不保存第三方完整原文、原图、平台截图、Cookie、Token 或抓取缓存。

`xhs-hot-skill` 使用 MIT License。`guizang-social-card-skill` 是独立的 AGPL-3.0 外部依赖；本项目不复制或内嵌其源码、模板和素材。第三方内容与商标归各自权利人所有。

本项目与小红书、Khazix、Guizang 及其作者没有官方隶属或背书关系。README 仅借鉴开源项目常见的信息组织方式，文案、品牌与演示资产均为本项目独立制作。

## 验证

```bash
node scripts/validate-corpus.mjs
node scripts/validate-skill.mjs
node --test
node scripts/check-readme-links.mjs
```

当前测试包含 20 类 × 3 个选题，共 60 个分类文案用例；另有模糊选题、信息不足、安全、版权和缺失 Guizang 等边界用例。每套演示图还要通过 Guizang validator，目标为 `0 FAIL`。

## 常用请求

```text
用 $xhs-hot-skill 做“第一次去新疆的 7 天游旅行路线”。先给我方向，不要直接写全文。

把这个产品体验改成好物测评。事实只用我给的内容，缺少的数据标出来。

选择方向 A，把正文控制在 400 字左右，再用 Guizang 的 Swiss 风出 6 张图。

更新样本库：补充最近 30 天的 AI 工具类样本，只保存公开元数据和派生规律。
```

## FAQ

**一定要装 Guizang 吗？**  
不需要。没有 Guizang 时，Skill 仍会交付完整文案包和可直接渲染的视觉 brief，但不会声称已经出图。

**每次都会搜索小红书吗？**  
不会。正常生成使用仓库内已经提炼的风格库。只有你明确要求更新样本库或核实最新事实时才联网。

**为什么先选方向，不能一步出全文？**  
同一个选题可以强调教程、观点或对比。先选方向能避免文案写完后才发现视觉和叙事都不合适。你也可以明确要求同时生成全部方向。

**能保证爆款吗？**  
不能。Skill 提供经过分类研究的表达规律、清晰结构和视觉规则，但流量还受账号、素材、发布时间、封面竞争和平台分发影响。

**可以商用吗？**  
MIT 代码与规则可以按许可证使用。你仍需确认自己使用的文案事实、人物肖像、品牌素材、照片、字体和外部依赖是否具备相应权利。

## 参与贡献

样本更新、场景配方和测试要求见 [CONTRIBUTING.md](./CONTRIBUTING.md)。版本记录见 [CHANGELOG.md](./CHANGELOG.md)。

---

<div align="center">

一个选题，先把方向选对，再把图文做好。

</div>
