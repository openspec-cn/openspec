import { Command } from 'commander';
import { createRequire } from 'module';
import ora from 'ora';
import path from 'path';
import { promises as fs } from 'fs';
import { AI_TOOLS } from '../core/config.js';
import { UpdateCommand } from '../core/update.js';
import { ListCommand } from '../core/list.js';
import { ArchiveCommand } from '../core/archive.js';
import { ViewCommand } from '../core/view.js';
import { registerSpecCommand } from '../commands/spec.js';
import { ChangeCommand } from '../commands/change.js';
import { ValidateCommand } from '../commands/validate.js';
import { ShowCommand } from '../commands/show.js';
import { CompletionCommand } from '../commands/completion.js';
import { FeedbackCommand } from '../commands/feedback.js';
import { registerConfigCommand } from '../commands/config.js';
import { registerSchemaCommand } from '../commands/schema.js';
import {
  statusCommand,
  instructionsCommand,
  applyInstructionsCommand,
  templatesCommand,
  schemasCommand,
  newChangeCommand,
  DEFAULT_SCHEMA,
  type StatusOptions,
  type InstructionsOptions,
  type TemplatesOptions,
  type SchemasOptions,
  type NewChangeOptions,
} from '../commands/workflow/index.js';
import { maybeShowTelemetryNotice, trackCommand, shutdown } from '../telemetry/index.js';

const program = new Command();
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

/**
 * Get the full command path for nested commands.
 * For example: 'change show' -> 'change:show'
 */
function getCommandPath(command: Command): string {
  const names: string[] = [];
  let current: Command | null = command;

  while (current) {
    const name = current.name();
    // Skip the root 'openspec' command
    if (name && name !== 'openspec') {
      names.unshift(name);
    }
    current = current.parent;
  }

  return names.join(':') || 'openspec';
}

program
  .name('openspec')
  .description('AI 原生规范驱动开发系统')
  .version(version);

// Global options
program.option('--no-color', '禁用彩色输出');

// Apply global flags and telemetry before any command runs
// Note: preAction receives (thisCommand, actionCommand) where:
// - thisCommand: the command where hook was added (root program)
// - actionCommand: the command actually being executed (subcommand)
program.hook('preAction', async (thisCommand, actionCommand) => {
  const opts = thisCommand.opts();
  if (opts.color === false) {
    process.env.NO_COLOR = '1';
  }

  // Show first-run telemetry notice (if not seen)
  await maybeShowTelemetryNotice();

  // Track command execution (use actionCommand to get the actual subcommand)
  const commandPath = getCommandPath(actionCommand);
  await trackCommand(commandPath, version);
});

// Shutdown telemetry after command completes
program.hook('postAction', async () => {
  await shutdown();
});

const availableToolIds = AI_TOOLS.filter((tool) => tool.skillsDir).map((tool) => tool.value);
const toolsOptionDescription = `非交互式配置 AI 工具。使用 "all"、"none" 或逗号分隔的列表：${availableToolIds.join(', ')}`;

program
  .command('init [path]')
  .description('在当前项目中初始化 OpenSpec')
  .option('--tools <tools>', toolsOptionDescription)
  .option('--force', '不提示直接清理旧文件')
  .action(async (targetPath = '.', options?: { tools?: string; force?: boolean }) => {
    try {
      // Validate that the path is a valid directory
      const resolvedPath = path.resolve(targetPath);

      try {
        const stats = await fs.stat(resolvedPath);
        if (!stats.isDirectory()) {
          throw new Error(`Path "${targetPath}" is not a directory`);
        }
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // Directory doesn't exist, but we can create it
          console.log(`Directory "${targetPath}" doesn't exist, it will be created.`);
        } else if (error.message && error.message.includes('not a directory')) {
          throw error;
        } else {
          throw new Error(`Cannot access path "${targetPath}": ${error.message}`);
        }
      }

      const { InitCommand } = await import('../core/init.js');
      const initCommand = new InitCommand({
        tools: options?.tools,
        force: options?.force,
      });
      await initCommand.execute(targetPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Hidden alias: 'experimental' -> 'init' for backwards compatibility
program
  .command('experimental', { hidden: true })
  .description('init 的别名（已弃用）')
  .option('--tool <tool-id>', '目标 AI 工具（映射到 --tools）')
  .option('--no-interactive', '禁用交互式提示')
  .action(async (options?: { tool?: string; noInteractive?: boolean }) => {
    try {
      console.log('注意: "openspec experimental" 已弃用。请使用 "openspec init"。');
      const { InitCommand } = await import('../core/init.js');
      const initCommand = new InitCommand({
        tools: options?.tool,
        interactive: options?.noInteractive === true ? false : undefined,
      });
      await initCommand.execute('.');
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('update [path]')
  .description('更新 OpenSpec 指令文件')
  .option('--force', '即使工具已最新也强制更新')
  .action(async (targetPath = '.', options?: { force?: boolean }) => {
    try {
      const resolvedPath = path.resolve(targetPath);
      const updateCommand = new UpdateCommand({ force: options?.force });
      await updateCommand.execute(resolvedPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('列出项目（默认列出变更）。使用 --specs 列出规范。')
  .option('--specs', '列出规范而不是变更')
  .option('--changes', '显式列出变更（默认）')
  .option('--sort <order>', '排序方式："recent"（默认）或 "name"', 'recent')
  .option('--json', '输出 JSON（供程序使用）')
  .action(async (options?: { specs?: boolean; changes?: boolean; sort?: string; json?: boolean }) => {
    try {
      const listCommand = new ListCommand();
      const mode: 'changes' | 'specs' = options?.specs ? 'specs' : 'changes';
      const sort = options?.sort === 'name' ? 'name' : 'recent';
      await listCommand.execute('.', mode, { sort, json: options?.json });
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('显示规范和变更的交互式仪表盘')
  .action(async () => {
    try {
      const viewCommand = new ViewCommand();
      await viewCommand.execute('.');
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Change command with subcommands
const changeCmd = program
  .command('change')
  .description('管理 OpenSpec 变更提案');

// Deprecation notice for noun-based commands
changeCmd.hook('preAction', () => {
  console.error('警告: "openspec change ..." 命令已弃用。请优先使用动词开头的命令（如 "openspec list", "openspec validate --changes"）。');
});

changeCmd
  .command('show [change-name]')
  .description('以 JSON 或 Markdown 格式显示变更提案')
  .option('--json', '输出 JSON')
  .option('--deltas-only', '仅显示增量（仅 JSON）')
  .option('--requirements-only', 'deltas-only 的别名（已弃用）')
  .option('--no-interactive', '禁用交互式提示')
  .action(async (changeName?: string, options?: { json?: boolean; requirementsOnly?: boolean; deltasOnly?: boolean; noInteractive?: boolean }) => {
    try {
      const changeCommand = new ChangeCommand();
      await changeCommand.show(changeName, options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('list')
  .description('列出所有活跃变更（已弃用：请使用 "openspec list"）')
  .option('--json', '输出 JSON')
  .option('--long', '显示 ID 和标题以及计数')
  .action(async (options?: { json?: boolean; long?: boolean }) => {
    try {
      console.error('警告: "openspec change list" 已弃用。请使用 "openspec list"。');
      const changeCommand = new ChangeCommand();
      await changeCommand.list(options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('validate [change-name]')
  .description('验证变更提案')
  .option('--strict', '启用严格验证模式')
  .option('--json', '输出 JSON 格式的验证报告')
  .option('--no-interactive', '禁用交互式提示')
  .action(async (changeName?: string, options?: { strict?: boolean; json?: boolean; noInteractive?: boolean }) => {
    try {
      const changeCommand = new ChangeCommand();
      await changeCommand.validate(changeName, options);
      if (typeof process.exitCode === 'number' && process.exitCode !== 0) {
        process.exit(process.exitCode);
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

program
  .command('archive [change-name]')
  .description('归档已完成的变更并更新主规范')
  .option('-y, --yes', '跳过确认提示')
  .option('--skip-specs', '跳过规范更新操作（适用于基础设施、工具或仅文档变更）')
  .option('--no-validate', '跳过验证（不推荐，需要确认）')
  .action(async (changeName?: string, options?: { yes?: boolean; skipSpecs?: boolean; noValidate?: boolean; validate?: boolean }) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.execute(changeName, options);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

registerSpecCommand(program);
registerConfigCommand(program);
registerSchemaCommand(program);

// Top-level validate command
program
  .command('validate [item-name]')
  .description('验证变更和规范')
  .option('--all', '验证所有变更和规范')
  .option('--changes', '验证所有变更')
  .option('--specs', '验证所有规范')
  .option('--type <type>', '在模棱两可时指定项目类型：change|spec')
  .option('--strict', '启用严格验证模式')
  .option('--json', '输出 JSON 格式的验证结果')
  .option('--concurrency <n>', '最大并发验证数（默认为 env OPENSPEC_CONCURRENCY 或 6）')
  .option('--no-interactive', '禁用交互式提示')
  .action(async (itemName?: string, options?: { all?: boolean; changes?: boolean; specs?: boolean; type?: string; strict?: boolean; json?: boolean; noInteractive?: boolean; concurrency?: string }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.execute(itemName, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Top-level show command
program
  .command('show [item-name]')
  .description('显示变更或规范')
  .option('--json', '输出 JSON')
  .option('--type <type>', '在模棱两可时指定项目类型：change|spec')
  .option('--no-interactive', '禁用交互式提示')
  // change-only flags
  .option('--deltas-only', '仅显示增量（仅 JSON，变更）')
  .option('--requirements-only', 'deltas-only 的别名（已弃用，变更）')
  // spec-only flags
  .option('--requirements', '仅 JSON：仅显示需求（排除场景）')
  .option('--no-scenarios', '仅 JSON：排除场景内容')
  .option('-r, --requirement <id>', '仅 JSON：通过 ID 显示特定需求（从 1 开始）')
  // allow unknown options to pass-through to underlying command implementation
  .allowUnknownOption(true)
  .action(async (itemName?: string, options?: { json?: boolean; type?: string; noInteractive?: boolean; [k: string]: any }) => {
    try {
      const showCommand = new ShowCommand();
      await showCommand.execute(itemName, options ?? {});
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Feedback command
program
  .command('feedback <message>')
  .description('提交关于 OpenSpec 的反馈')
  .option('--body <text>', '反馈的详细描述')
  .action(async (message: string, options?: { body?: string }) => {
    try {
      const feedbackCommand = new FeedbackCommand();
      await feedbackCommand.execute(message, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Completion command with subcommands
const completionCmd = program
  .command('completion')
  .description('管理 OpenSpec CLI 的 Shell 补全');

completionCmd
  .command('generate [shell]')
  .description('生成 Shell 补全脚本（输出到 stdout）')
  .action(async (shell?: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.generate({ shell });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('install [shell]')
  .description('安装 Shell 补全脚本')
  .option('--verbose', '显示详细安装输出')
  .action(async (shell?: string, options?: { verbose?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.install({ shell, verbose: options?.verbose });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('uninstall [shell]')
  .description('卸载 Shell 补全脚本')
  .option('-y, --yes', '跳过确认提示')
  .action(async (shell?: string, options?: { yes?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.uninstall({ shell, yes: options?.yes });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Hidden command for machine-readable completion data
program
  .command('__complete <type>', { hidden: true })
  .description('以机器可读格式输出补全数据（内部使用）')
  .action(async (type: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.complete({ type });
    } catch (error) {
      // Silently fail for graceful shell completion experience
      process.exitCode = 1;
    }
  });

// ═══════════════════════════════════════════════════════════
// Workflow Commands (formerly experimental)
// ═══════════════════════════════════════════════════════════

// Status command
program
  .command('status')
  .description('显示变更的产物完成状态')
  .option('--change <id>', '要显示状态的变更名称')
  .option('--schema <name>', 'Schema 覆盖（从 config.yaml 自动检测）')
  .option('--json', '输出 JSON')
  .action(async (options: StatusOptions) => {
    try {
      await statusCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Instructions command
program
  .command('instructions [artifact]')
  .description('输出创建产物或应用任务的丰富指令')
  .option('--change <id>', '变更名称')
  .option('--schema <name>', 'Schema 覆盖（从 config.yaml 自动检测）')
  .option('--json', '输出 JSON')
  .action(async (artifactId: string | undefined, options: InstructionsOptions) => {
    try {
      // Special case: "apply" is not an artifact, but a command to get apply instructions
      if (artifactId === 'apply') {
        await applyInstructionsCommand(options);
      } else {
        await instructionsCommand(artifactId, options);
      }
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Templates command
program
  .command('templates')
  .description('显示 Schema 中所有产物的解析模板路径')
  .option('--schema <name>', `使用的 Schema（默认：${DEFAULT_SCHEMA}）`)
  .option('--json', '输出将产物 ID 映射到模板路径的 JSON')
  .action(async (options: TemplatesOptions) => {
    try {
      await templatesCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Schemas command
program
  .command('schemas')
  .description('列出可用的工作流 Schema 及其描述')
  .option('--json', '输出 JSON（供 agent 使用）')
  .action(async (options: SchemasOptions) => {
    try {
      await schemasCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// New command group with change subcommand
const newCmd = program.command('new').description('创建新项目');

newCmd
  .command('change <name>')
  .description('创建一个新的变更目录')
  .option('--description <text>', '添加到 README.md 的描述')
  .option('--schema <name>', `使用的工作流 Schema（默认：${DEFAULT_SCHEMA}）`)
  .action(async (name: string, options: NewChangeOptions) => {
    try {
      await newChangeCommand(name, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
