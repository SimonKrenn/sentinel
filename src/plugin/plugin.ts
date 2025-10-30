import { spawn } from "bun";

const git = async (args: string[]) => {
	const proc = spawn(["git", ...args], { stdout: "pipe", stderr: "pipe" });
	const out = await new Response(proc.stdout).text();
	const code = await proc.exited;
	if (code !== 0) {
		throw new Error(`git ${args.join(" ")} failed`);
	}
	return out.trim();
};

export const localProvider = () => {
	return {
		name: "local",
		getDiff: async (): Promise<any[]> => {
			//currently assumes base branch is main
			const base = await git(["rev-parse", "--verify", "origin/main"])
				.then(() => "origin/main")
				.catch(() => "HEAD~1");
			const raw = await git(["diff", "--name-status", `${base}...HEAD`]);
			return raw
				.split("\n")
				.filter(Boolean)
				.map((line) => {
					const [status, ...rest] = line.split("/s+/");
					const path = rest[rest.length - 1];
					const s = status?.startsWith("A")
						? "added"
						: status?.startsWith("D")
							? "deleted"
							: status?.startsWith("R")
								? "renamed"
								: "modified";

					return { path, s };
				});
		},
		getPR: async () => {
			throw new Error("not supported in this env");
		},
		postComment: async (md: string) => {
			console.log(md);
		},
	};
};
