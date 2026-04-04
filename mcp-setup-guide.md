# Cocos MCP Server Setup & IDE Integration Guide

This guide explains how to start the Cocos Model Context Protocol (MCP) server and how to configure it in popular AI IDEs (like Cursor, Trae, or Claude Desktop) so the AI assistant can interact with your Cocos project.

---

## 1. How to Start the Cocos MCP Server

The Cocos CLI provides a built-in command to launch the MCP server. This server needs to be attached to a specific Cocos project.

### Method A: Using the global `cocos` command
If you have installed `cocos-cli` globally, you can start the server using the `start-mcp-server` command.

```bash
# Basic usage (defaults to stdio transport)
cocos start-mcp-server --project /path/to/your/cocos/project
```

### Method B: From the Source Code (For Development)
If you are developing or testing within the `cocos-cli` repository itself, you can use the npm scripts:

```bash
# Start the MCP server pointing to a test project
npm run start:mcp-debug

# Or use the built CLI file directly
node ./dist/cli.js start-mcp-server --project=/path/to/your/cocos/project
```

---

## 2. How to Configure MCP in Your IDE

AI IDEs support adding custom MCP servers. Since `cocos-cli` communicates via the standard MCP protocol over `stdio` (Standard Input/Output), you can easily add it to your IDE settings.

### 🔌 In Cursor / Trae
1. Open Settings (`Cmd + ,` or `Ctrl + ,`).
2. Navigate to **Features** -> **MCP** (or search for "MCP" in settings).
3. Click **+ Add new MCP server**.
4. Configure the server:
   - **Name**: `Cocos MCP` (or anything you prefer)
   - **Type**: `command` (or `stdio`)
   - **Command**:
     ```bash
     cocos start-mcp-server --project /path/to/your/cocos/project
     ```
     *(Note: If the IDE cannot find the `cocos` command, provide the absolute path to your Node.js binary and the `cli.js` file, e.g., `/usr/local/bin/node /path/to/cocos-cli/dist/cli.js start-mcp-server --project /path/to/your/cocos/project`)*

### 🔌 In Claude Desktop App
1. Open the Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the Cocos MCP server configuration:
   ```json
   {
     "mcpServers": {
       "cocos": {
         "command": "cocos",
         "args": [
           "start-mcp-server",
           "--project",
           "/path/to/your/cocos/project"
         ]
       }
     }
   }
   ```
   *(Again, if `cocos` is not in your system PATH, use the absolute path to `node` and the `cli.js` script in `args`)*.
3. Save the file and **Restart Claude Desktop**.

---

## 3. Verify the Connection

Once configured, ask your IDE's AI assistant:
> *"What tools are available in the Cocos MCP server?"*

If successful, the AI should list tools like `scene-open`, `assets-query-uuid`, `builder-build`, etc., and you can start asking it to modify your Cocos project!