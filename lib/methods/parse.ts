import { GqlSchemaError } from "~/error";
import type { GqlSchema } from "~/schemas";
import type { InferIssue, InferOutput } from "~/types";
import type { Config } from "~/types/config";

export function gqlParse<const S extends GqlSchema>(
	schema: S,
	input: unknown,
	config?: Config<InferIssue<S>>,
): InferOutput<S> {
	const dataset = schema["~run"](
		{
			value: input,
		},
		config ?? {},
	);

	if (dataset.issues) {
		throw new GqlSchemaError(dataset.issues);
	}

	return dataset.value;
}

export { gqlParse as parse };
