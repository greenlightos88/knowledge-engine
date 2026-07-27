import { assembleContext, validateRepositoryInputs } from "./runtime";

function usage(): never {
  console.error("Usage: bun run src/cli.ts <assemble|validate> <task.yaml> [model]");
  process.exit(1);
}

const [, , command, taskPath, requestedModel = "chatgpt"] = process.argv;
if (!command || !taskPath) usage();

try {
  if (command === "assemble") {
    console.log(JSON.stringify(await assembleContext(taskPath, requestedModel), null, 2));
  } else if (command === "validate") {
    const result = await validateRepositoryInputs(taskPath, requestedModel);
    console.log(JSON.stringify(result, null, 2));
    if (!result.valid) process.exitCode = 2;
  } else {
    usage();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ valid: false, error: message }, null, 2));
  process.exitCode = 1;
}
