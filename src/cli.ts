import { writeFile } from "node:fs/promises";
import { generateTaskEnvelope } from "./intake";
import { runTask } from "./orchestrator";
import { assembleContext, validateRepositoryInputs } from "./runtime";

function usage(): never {
  console.error([
    "Usage:",
    "  bun run src/cli.ts intake <model> <request...>",
    "  bun run src/cli.ts assemble <task.yaml> [model]",
    "  bun run src/cli.ts validate <task.yaml> [model]",
    "  bun run src/cli.ts run <task.yaml> [model] [provider]",
  ].join("\n"));
  process.exit(1);
}

const [, , command, ...args] = process.argv;
if (!command) usage();

try {
  if (command === "intake") {
    const [model = "chatgpt", ...requestParts] = args;
    const request = requestParts.join(" ").trim();
    if (!request) usage();
    const result = await generateTaskEnvelope(request, model);
    const outputPath = `.greenlit/${result.task.task_id}.yaml`;
    await Bun.write(outputPath, result.yaml);
    console.log(JSON.stringify({ ...result, output_path: outputPath, yaml: undefined }, null, 2));
  } else if (command === "assemble") {
    const [taskPath, model = "chatgpt"] = args;
    if (!taskPath) usage();
    console.log(JSON.stringify(await assembleContext(taskPath, model), null, 2));
  } else if (command === "validate") {
    const [taskPath, model = "chatgpt"] = args;
    if (!taskPath) usage();
    const result = await validateRepositoryInputs(taskPath, model);
    console.log(JSON.stringify(result, null, 2));
    if (!result.valid) process.exitCode = 2;
  } else if (command === "run") {
    const [taskPath, model = "chatgpt", provider = "dry-run"] = args;
    if (!taskPath) usage();
    console.log(JSON.stringify(await runTask(taskPath, model, provider), null, 2));
  } else {
    usage();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ valid: false, error: message }, null, 2));
  process.exitCode = 1;
}
