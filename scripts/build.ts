import { build } from "bun";

await Promise.all([
	build({
		entrypoints: ["./lib/index.ts"],
		outdir: "./dist",
		minify: true,
	}),
]);
