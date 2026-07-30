# BLOCKED

## 2026-07-30 · 小红书视觉详情抽检受平台安全验证限制（已解除）

- 状态：用户重新登录后复测通过；前台搜索、旅行与 AI Skill 两条详情、封面大图、正文评论区及创作后台均可访问，未再出现登录或验证码拦截。
- 本次边界：仅做只读核验，未点赞、收藏、评论或发布；未保存第三方原图、截图、正文、Cookie、Token 或缓存。
- 后续：原先未完成的 10 类详情级视觉增量，可在下一次明确执行“更新样本库”时继续抽检，不影响当前 400 条语料与 20 类配方的既有验收结果。

- 现象：从站内搜索结果进入多条笔记后，Chrome 跳转到 `website-login/captcha`；按浏览器安全规则未自行处理或绕过验证码。
- 影响：`study-exams`、`books-knowledge`、`content-photography`、`travel-guides`、`local-discovery`、`food-recipes`、`home-organization`、`renovation-renting`、`fashion`、`beauty-skincare` 未完成详情级封面抽检。
- 已完成：AI 工具、数码软件、办公效率、职场求职各有 1 条详情级视觉记录；A/B 的 280 条来源、标题、正文结构和公开互动已完成实时研究。
- 边界：未保存截图、原图或验证页面；未把未打开的封面写成已核验，也未因验证码更换入口规避平台限制。
- 后续：样本合并、场景配方、测试、演示、安装和发布不受影响；详情级视觉增量可在安全验证解除后的“更新样本库”模式补齐。

## 2026-07-30 · 子智能体误改范围外既有文件

- 事实：Owner C 报告误改了 `/Users/qixiaoc/Code/mani/local-tests/ai-skills-starter-xhs/` 下的 `POST.md`、`index.html`、`CONTENT_STYLE.md`、`RESEARCH.md`，未执行 Git 操作。
- 处置：根流程不读取、不继续修改，也不在缺少可靠基线时猜测回滚；Owner C 后续仅允许写本仓库的 `data/shards/c.jsonl` 与 6 个 scene 文件。
- 影响：这 4 个文件不属于 `xhs-hot-skill` 交付物，不会进入仓库或安装包；用户如需恢复，应基于该目录自己的版本历史处理。

## 2026-07-30 · 最终审计中 Guizang validator 当前环境复跑中断（已解除）

- 解决：按用户“缺什么就装”的授权安装与当前 Playwright 匹配的 Chromium，再用仓库内临时模块解析器调用未修改的外部 validator。
- 结果：AI 工具、办公效率、旅行攻略、生活方式、产品测评五套均为 `0 fails`；每套仅有 5 个 R5 密度 WARN，属于 validator 明确标注的 advisory，不影响退出码。

- 连续三次执行环境失败：外部 validator 目录无法解析 `playwright`；首次改道误用了 `/tmp` 而实际 `os.tmpdir()` 位于 `/var/folders/...`；修正路径后发现当前 Playwright 版本缺少对应 Chromium Headless Shell。
- 当时处置：按“三次失败换项”规则先停止同路径重试；没有修改 Guizang 源码、validator、测试判断或图片来规避问题。
- 最终证据：安装匹配浏览器后，五套演示均取得当前态 `0 fails`；validator 与验收脚本 SHA256 继续为 `OK`，远端安装副本的语料、Skill、74 项测试、README 链接及 1080×1440 尺寸也已通过。
