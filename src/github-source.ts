import { z } from "zod";

const GitHubContentSchema = z.object({
  type: z.literal("file"),
  encoding: z.literal("base64"),
  content: z.string(),
  sha: z.string(),
  path: z.string(),
});

export type RemoteSource = {
  repository: string;
  ref: string;
  path: string;
  sha: string;
  content: string;
};

export async function fetchGitHubSource(
  repository: string,
  path: string,
  ref: string,
  token = process.env.GITHUB_TOKEN,
): Promise<RemoteSource> {
  if (!token) throw new Error("GITHUB_TOKEN is required for cross-repository project loading.");

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${repository}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "greenlit-knowledge-engine",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub source fetch failed for ${repository}@${ref}:${path} (${response.status}): ${body.slice(0, 300)}`);
  }

  const parsed = GitHubContentSchema.parse(await response.json());
  return {
    repository,
    ref,
    path: parsed.path,
    sha: parsed.sha,
    content: Buffer.from(parsed.content.replace(/\n/g, ""), "base64").toString("utf8"),
  };
}
