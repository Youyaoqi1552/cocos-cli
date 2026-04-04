# Cocos CLI MCP Skill Guide

## Overview
This skill provides instructions on how to effectively use the **Cocos CLI MCP Server**. The Cocos MCP server exposes a wide range of tools that allow you (the AI) to interact with, manage, and modify Cocos Creator projects headlessly. 

Whenever the user asks you to perform operations on a Cocos project (like modifying scenes, managing assets, or building the project), you should utilize the provided MCP tools instead of manually editing project files (which can corrupt the project).

## Available Tool Categories & Capabilities

The MCP server exposes several prefixes for different domains of the Cocos Engine.

### 1. Scene & Node Management (`scene-*`)
These tools allow you to read and modify the currently open scene.
- **Scene Lifecycle**: `scene-open`, `scene-save`, `scene-create`, `scene-reload`, `scene-query-current`.
- **Node Operations**: `scene-query-node` (to inspect a node's structure/components), `scene-create-node-by-type`, `scene-create-node-by-asset` (e.g., instantiating a prefab), `scene-delete-node`, `scene-update-node` (changing transforms, names, etc.).
- **Component Operations**: `scene-add-component`, `scene-delete-component`, `scene-query-component`, `scene-query-all-component`, `scene-set-component-property`.
- **Prefab Operations**: `create-prefab-from-node`, `apply-prefab-changes`, `revert-prefab`, `unpack-prefab`, `is-prefab-instance`.

### 2. Asset Management (`assets-*`)
These tools handle the Cocos Asset Database (`db://assets/...`).
- **Querying**: `assets-query-asset-info`, `assets-query-asset-meta`, `assets-query-uuid`, `assets-query-path`, `assets-query-url`.
- **Modifying**: `assets-create-asset`, `assets-create-asset-by-type`, `assets-delete-asset`, `assets-rename-asset`, `assets-move-asset`, `assets-save-asset`.
- **Import/Refresh**: `assets-import-asset`, `assets-reimport-asset`, `assets-refresh` (Crucial when files are modified on the OS level).
- **Meta/UserData**: `assets-update-asset-user-data`, `assets-query-asset-user-data-config`, `assets-update-default-user-data`.

### 3. Build & Publish (`builder-*`)
- **Building**: `builder-query-default-build-config`, `builder-build` (compiles the project for platforms like `web-mobile`, `android`, etc.), `builder-make`, `builder-run`.

### 4. System & Files (`system-*`, `file-*`)
- **Logs**: `system-query-logs`, `system-clear-logs`.
- **File Edits**: `file-insert-text`, `file-delete-text`, `file-replace-text`, `file-query-text`.

---

## Standard Workflows & Best Practices

### Workflow 1: Modifying a Scene
When a user asks you to modify something in a scene (e.g., "Change the background color" or "Add a label"):
1. **Check current scene**: Use `scene-query-current` to get the UUID of the currently active scene. If it's not the target scene, use `scene-open` to open the target scene.
2. **Query target node**: Use `scene-query-node` with the node's UUID or path to understand its current state and attached components.
3. **Modify**:
   - To change node properties (position, scale, rotation), use `scene-update-node`.
   - To modify a component (like a Sprite or Label), use `scene-set-component-property`.
   - To add a new UI element, use `scene-create-node-by-type` and then `scene-add-component`.
4. **Save**: **Always** call `scene-save` when your modifications are complete.

### Workflow 2: Asset Operations
When a user asks you to import or modify an asset (e.g., an image or script):
1. **Find the Asset**: Use `assets-query-url` or `assets-query-uuid` to get the exact identifier. Cocos assets are typically referenced by their `db://` URL or UUID.
2. **Perform Operation**: Use `assets-import-asset` or `assets-update-asset-user-data` (for changing import settings like texture type).
3. **Sync**: If you use standard file writing tools to create a file in the `assets/` folder, you **must** call `assets-refresh` so the Cocos engine registers the new file and generates a `.meta` file.

### Workflow 3: Building the Project
1. Use `builder-query-default-build-config` to inspect the platform-specific build parameters.
2. Call `builder-build` with the required parameters (like `platform: "web-mobile"`). Monitor the output or logs (`system-query-logs`) for errors.

## ⚠️ Important Rules for the AI
1. **Never edit `.meta` files manually.** Always use the `assets-*` MCP tools to modify asset properties or user data. Manually editing `.meta` files can corrupt the asset database.
2. **Never edit `.scene` or `.prefab` JSON files manually.** Always use the `scene-*` MCP tools to query and update nodes/components.
3. **Component Names**: When adding components, use the full Cocos class name (e.g., `cc.Sprite`, `cc.Label`, `cc.UITransform`).
4. **UUIDs are King**: Most tools require a `uuid`. If the user gives you a file path, resolve it to a `uuid` first using `assets-query-uuid`.
5. **Always Save**: Scene modifications exist in memory until `scene-save` is called. Do not forget to save.