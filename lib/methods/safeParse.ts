import type { GqlSchema } from "~/schemas";
import type { InferIssue, InferOutput } from "~/types";
import type { Config } from "~/types/config";

export type SafeParseResult<S extends GqlSchema> =
	| {
			success: true;
			value: InferOutput<S>;
			issues?: never;
	  }
	| {
			success: false;
			value?: never;
			issues: [InferIssue<S>, ...InferIssue<S>[]];
	  };

export function gqlSafeParse<const S extends GqlSchema>(
	schema: S,
	input: unknown,
	config?: Config<InferIssue<S>>,
): SafeParseResult<S> {
	const dataset = schema["~run"](
		{
			value: input,
		},
		config ?? {},
	);

	if (dataset.issues) {
		return {
			success: false,
			issues: dataset.issues,
		};
	}

	return {
		success: true,
		value: dataset.value,
	};
}

export { gqlSafeParse as safeParse };
