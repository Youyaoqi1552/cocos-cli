# Cocos CLI — AI Agent Skills & Guide

> 面向 AI 代理（Claude、GPT、Copilot 等）的 Cocos CLI 使用技能指南。本文件通过 MCP Resources 自动提供给连接的 AI 客户端。

---

## Quick Start

### 通过 MCP 服务器交互（推荐）

```bash
cocos start-mcp-server --project /path/to/project --port 9527
```

项目在启动时自动打开，所有 MCP 工具都在此项目上下文中操作。

### 通过 CLI 命令操作

```bash
cocos create --project ./my-game --type 3d     # 创建项目
cocos build --project ./my-game --platform web-mobile  # 构建项目
cocos wizard                                    # 交互式向导
```

---

## MCP Tool Catalog (50 Tools)

### Asset Management (18 tools)

管理项目资源（图片、脚本、场景、材质等）。

| Tool | 用途 |
|------|------|
| `assets-query-asset-info` | 通过路径、URL 或 UUID 查询资产详情 |
| `assets-query-asset-meta` | 读取 .meta 导入配置 |
| `assets-query-create-map` | 查看可创建的资产类型映射 |
| `assets-create-asset-by-type` | 按类型创建资产（脚本、材质、场景、预制体等） |
| `assets-create-asset` | 从内容字符串创建资产 |
| `assets-import-asset` | 从外部导入文件到项目 |
| `assets-save-asset` | 写入文本类资产内容 |
| `assets-delete-asset` | 删除资产（不可逆） |
| `assets-rename-asset` | 重命名资产 |
| `assets-move-asset` | 移动资产 |
| `assets-refresh` | 重新扫描目录 |
| `assets-reimport-asset` | 强制重新导入资产 |
| `assets-query-uuid` / `assets-query-path` / `assets-query-url` | 三种标识符互转 |
| `assets-update-asset-user-data` | 修改资产用户数据 |
| `assets-query-asset-user-data-config` | 查询资产用户数据配置 |

### Scene Editing (6 tools)

打开、创建、保存场景和预制体。

| Tool | 用途 |
|------|------|
| `scene-open` | 打开场景 (.scene) 或预制体 (.prefab) |
| `scene-query-current` | 查看当前打开的内容 |
| `scene-save` | 保存当前场景/预制体 |
| `scene-close` | 关闭当前场景/预制体 |
| `scene-create` | 创建新场景资产 |
| `scene-reload` | 从磁盘重新加载当前场景 |

### Node Operations (5 tools)

在当前场景中创建、修改、查询节点。

| Tool | 用途 |
|------|------|
| `scene-create-node-by-type` | 添加节点 |
| `scene-create-node-by-asset` | 从预制体实例化节点 |
| `scene-query-node` | 查询节点属性、子节点、组件 |
| `scene-update-node` | 修改位置、旋转、缩放、名称、激活状态 |
| `scene-delete-node` | 删除节点 |

**可用节点类型：** Empty, Terrain, Camera, Sprite, SpriteSplash, Graphics, Label, Mask, Particle, TiledMap, Capsule, Cone, Cube, Cylinder, Plane, Quad, Sphere, Torus

### Component Operations (5 tools)

在场景节点上添加、配置、查询组件。

| Tool | 用途 |
|------|------|
| `scene-query-all-component` | 列出所有可用组件类型（建议先调用） |
| `scene-add-component` | 给节点添加组件 |
| `scene-query-component` | 读取组件属性 |
| `scene-set-component-property` | 修改组件属性 |
| `scene-delete-component` | 删除组件 |

### Prefab Operations (5 tools)

管理预制体实例和资产。

| Tool | 用途 |
|------|------|
| `create-prefab-from-node` | 将节点层级保存为预制体 |
| `apply-prefab-changes` | 将实例修改推回预制体资产 |
| `revert-prefab` | 将实例恢复为预制体原始状态 |
| `unpack-prefab` | 解除预制体关联（变为独立节点） |
| `is-prefab-instance` | 检查节点是否为预制体实例 |

### Build System (4 tools)

多平台构建、打包、运行。

| Tool | 用途 |
|------|------|
| `builder-query-default-build-config` | 获取平台默认构建配置（构建前先调用） |
| `builder-build` | 构建项目到目标平台 |
| `builder-make` | 编译原生二进制（仅 windows, mac, ios, android, google-play） |
| `builder-run` | 运行构建产物 |

### File Editing (4 tools)

编辑项目中的文本文件（脚本、配置等）。

| Tool | 用途 |
|------|------|
| `file-query-text` | 读取文件内容（可指定行范围） |
| `file-insert-text` | 在指定行号插入文本 |
| `file-replace-text` | 查找替换文本（支持正则） |
| `file-delete-text` | 删除行范围 |

### System & Configuration (3 tools)

| Tool | 用途 |
|------|------|
| `system-query-logs` | 查询 CLI 日志（调试用） |
| `system-clear-logs` | 清除日志 |
| `configuration-remigrate` | 重新生成 cocos.config.json |

---

## Key Concepts

### Asset Identifier Formats

所有资产工具接受三种标识符格式：

1. **db:// URL** — `db://assets/textures/hero.png`（推荐，稳定且可移植）
2. **UUID** — `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`
3. **File path** — `/absolute/path/to/assets/textures/hero.png`

### Node Paths

节点通过层级路径寻址：

```
Canvas              → "Canvas"
Canvas/Camera       → "Canvas/Camera"
Canvas/Player/Sprite → "Canvas/Player/Sprite"
```

组件路径 = 节点路径 + 组件名：

```
Canvas/Player/cc.Sprite
Canvas/Camera/cc.Camera
```

### Build Platforms

| Platform ID | 类型 | 支持 make |
|---|---|---|
| `web-desktop` | Web | No |
| `web-mobile` | Web | No |
| `windows` | Native | Yes |
| `mac` | Native | Yes |
| `ios` | Native | Yes |
| `android` | Native | Yes |
| `google-play` | Native | Yes |
| `ohos` | Native | No |
| `harmonyos-next` | Native | No |

### Result Format

所有工具返回 `CommonResultType`：

```json
{ "code": 200, "data": { ... } }    // 成功
{ "code": 500, "reason": "..." }     // 失败
```

使用前务必检查 `code` 字段。

---

## Common Workflows

### 1. 创建项目 + 搭建场景

```
1. cocos create --project ./my-game --type 3d
2. Start MCP server on ./my-game
3. assets-query-create-map → 了解可创建的资产类型
4. assets-create-asset-by-type → 创建场景
5. scene-open → 打开新场景
6. scene-create-node-by-type → 添加 Camera、灯光、3D 物体
7. scene-save → 保存修改
```

### 2. 构建发布

```
1. builder-query-default-build-config → 获取平台默认配置
2. builder-build → 构建到目标平台
3. builder-make → 编译原生二进制（原生平台需要）
4. builder-run → 运行产物
```

### 3. 编辑脚本

```
1. assets-query-asset-info → 找到脚本资产
2. file-query-text → 读取当前内容
3. file-replace-text → 修改代码
4. assets-reimport-asset → 触发重新导入
```

### 4. 预制体管理

```
1. scene-open → 打开包含目标节点的场景
2. scene-query-node → 确认节点结构
3. create-prefab-from-node → 保存为预制体
4. scene-create-node-by-asset → 在其他地方实例化预制体
```

---

## Development Guide (for contributors)

### Project Structure

```
src/
  cli.ts               # CLI 入口，注册所有命令
  api/                  # 公共 API 层（CLI 和 MCP 共用）
    index.ts            # CocosAPI 门面类
    schema.ts           # 共享 Zod schemas
    decorator/          # @tool, @param, @result 装饰器
    assets/ builder/ scene/ system/ configuration/ engine/ project/
  commands/             # CLI 命令 (Commander.js)
  core/                 # 内部引擎逻辑
  mcp/                  # MCP 服务器实现
  display/              # 交互式 CLI 工具
  i18n/                 # 国际化 (en + zh)
```

### Adding a New CLI Command

1. 创建 `src/commands/<name>.ts` 继承 `BaseCommand`
2. 实现 `register()` 使用 Commander 链式调用
3. action handler 中通过 `await import('../api/index')` 调用 `CocosAPI`
4. 在 `src/commands/index.ts` 导出并加入 `CommandClass` 类型联合
5. 在 `src/cli.ts` 注册: `commandRegistry.register(new MyCommand(program))`

### Adding a New MCP Tool

1. 在 `src/api/<domain>/<domain>.ts` 添加方法
2. 使用装饰器: `@tool`, `@title`, `@description`, `@param(Schema)`, `@result(Schema)`
3. 参数必须使用 `src/api/<domain>/schema.ts` 中的 Zod schemas
4. 返回 `CommonResultType<T>` (code 200/500, data, reason)
5. 运行 `npm run generate:mcp-types` 更新类型定义

### Build & Test

```bash
npm run build                    # 完整构建
npm test                         # 单元测试
npm run test:e2e                 # E2E 测试
npm run generate:mcp-types       # 生成 MCP 类型定义
```

### Conventions

- 所有 API 参数通过 Zod schemas 校验
- 全部使用动态导入 (`await import(...)`) 实现懒加载
- 资产标识符支持三种格式: db:// URL, UUID, 文件路径
- Commit 格式: Conventional Commits (feat:, fix:, refactor:, 等)
