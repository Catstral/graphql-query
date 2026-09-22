import { GqlIssue, GqlSchema } from "~/schemas";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";

export class GqlAnyIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "any";
}

export class GqlAnySchema extends GqlSchema<
	// biome-ignore lint/suspicious/noExplicitAny: Any schema required any type
	any,
	// biome-ignore lint/suspicious/noExplicitAny: Any schema required any type
	any,
	GqlAnyIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "any";
	public readonly expects = "any";

	public readonly "~run" = (dataset: UnknownDataset) => {
		// @ts-expect-error
		dataset.typed = true;

		// @ts-expect-error
		// biome-ignore lint/suspicious/noExplicitAny: Any schema required any type
		return dataset as OutputDataset<any, GqlAnyIssue>;
	};
}

export function gqlAny(): GqlAnySchema {
	return new GqlAnySchema();
}

export { gqlAny as any };

export function isGqlAny(value: unknown): value is GqlAnySchema {
	return value instanceof GqlAnySchema;
}

export { isGqlAny as isAny };
