import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { BaseCommand } from './base';
import { interactive } from '../display/interactive';

type WizardAction = 'create' | 'build' | 'preview' | 'mcp-server' | 'exit';

export class WizardCommand extends BaseCommand {
    register(): void {
        this.program
            .command('wizard')
            .description('Interactive wizard for guided Cocos project operations')
            .action(async () => {
                try {
                    await this.run();
                } catch (error: any) {
                    interactive.error(error.message || String(error));
                    process.exit(1);
                }
            });
    }

    private async run(): Promise<void> {
        interactive.showWelcome();

        let running = true;
        while (running) {
            const action = await this.selectAction();

            switch (action) {
                case 'create':
                    await this.handleCreate();
                    break;
                case 'build':
                    await this.handleBuild();
                    break;
                case 'preview':
                    await this.handlePreview();
                    break;
                case 'mcp-server':
                    await this.handleMcpServer();
                    break;
                case 'exit':
                    running = false;
                    interactive.info('Goodbye!');
                    break;
            }

            if (running) {
                interactive.separator();
                const cont = await interactive.confirm('Continue with another operation?', true);
                if (!cont) {
                    running = false;
                    interactive.info('Goodbye!');
                }
            }
        }
    }

    private async selectAction(): Promise<WizardAction> {
        return interactive.select<WizardAction>('What would you like to do?', [
            { name: 'Create a new project', value: 'create' },
            { name: 'Build a project', value: 'build' },
            { name: 'Preview a project', value: 'preview' },
            { name: 'Start MCP server', value: 'mcp-server' },
            { name: 'Exit', value: 'exit' },
        ]);
    }

    private async handleCreate(): Promise<void> {
        const projectPath = await interactive.input('Project path (absolute or relative)', './my-project');
        const resolvedPath = resolve(projectPath);
        const type = await interactive.select<'2d' | '3d'>('Project type', [
            { name: '3D (default)', value: '3d' },
            { name: '2D', value: '2d' },
        ]);

        interactive.separator();
        console.log(chalk.gray(`Path: ${resolvedPath}`));
        console.log(chalk.gray(`Type: ${type}`));

        if (existsSync(resolvedPath)) {
            const overwrite = await interactive.confirm('Target path already exists. Continue?', false);
            if (!overwrite) {
                interactive.warning('Create cancelled.');
                return;
            }
        }

        const confirmed = await interactive.confirm('Create project with these settings?', true);
        if (!confirmed) {
            interactive.warning('Create cancelled.');
            return;
        }

        interactive.startSpinner('Creating project...');
        const { CocosAPI } = await import('../api/index');
        const ok = await CocosAPI.createProject(resolvedPath, type);
        interactive.stopSpinner(ok, ok ? 'Project created!' : 'Failed to create project.');

        if (ok) {
            console.log(chalk.gray('Next steps:'));
            console.log(`  cd ${resolvedPath}`);
        }
    }

    private async handleBuild(): Promise<void> {
        const projectPath = await interactive.input('Project path', './');
        const resolvedPath = this.validateProjectPath(projectPath);

        const platform = await interactive.select<string>('Target platform', [
            { name: 'Web Mobile', value: 'web-mobile' },
            { name: 'Web Desktop', value: 'web-desktop' },
            { name: 'Android', value: 'android' },
            { name: 'iOS', value: 'ios' },
            { name: 'Windows', value: 'windows' },
            { name: 'macOS', value: 'mac' },
        ]);

        interactive.separator();
        console.log(chalk.gray(`Path: ${resolvedPath}`));
        console.log(chalk.gray(`Platform: ${platform}`));

        const confirmed = await interactive.confirm('Build project?', true);
        if (!confirmed) {
            interactive.warning('Build cancelled.');
            return;
        }

        interactive.startSpinner('Building project...');
        const { CocosAPI } = await import('../api/index');
        const { BuildExitCode } = await import('../core/builder/@types/protected');
        const result = await CocosAPI.buildProject(resolvedPath, platform, {});
        const ok = result.code === BuildExitCode.BUILD_SUCCESS;
        interactive.stopSpinner(ok, ok ? 'Build complete!' : 'Build failed.');
    }

    private async handlePreview(): Promise<void> {
        const projectPath = await interactive.input('Project path', './');
        const resolvedPath = this.validateProjectPath(projectPath);
        const portStr = await interactive.input('Port', '8000');
        const port = parseInt(portStr, 10) || 8000;

        interactive.startSpinner('Starting preview server...');
        const { default: Launcher } = await import('../core/launcher');
        const launcher = new Launcher(resolvedPath);
        await launcher.startPreview(port);
        interactive.stopSpinner(true, `Preview running at http://localhost:${port}`);
    }

    private async handleMcpServer(): Promise<void> {
        const projectPath = await interactive.input('Project path', './');
        const resolvedPath = this.validateProjectPath(projectPath);
        const portStr = await interactive.input('Port', '9527');
        const port = parseInt(portStr, 10) || 9527;

        interactive.startSpinner('Starting MCP server...');
        const { startServer } = await import('../mcp/start-server');
        await startServer(resolvedPath, port);
        interactive.stopSpinner(true, `MCP server running on port ${port}`);
    }
}
