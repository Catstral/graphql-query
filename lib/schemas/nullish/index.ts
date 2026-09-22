import { GqlIssue, GqlSchema } from "~/schemas";
import type { InferInput, InferOutput } from "~/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";

export class GqlNullishIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "nullish";
}

export class GqlNullishSchema<const S extends GqlSchema = GqlSchema> extends GqlSchema<
	InferOutput<S> | null | undefined,
	InferInput<S> | null | undefined,
	GqlNullishIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "nullish";
	public readonly expects: `(${S["expects"]} | null | undefined)`;
	public readonly wrapped: S;

	public constructor(wrapped: S) {
		super();

		this.wrapped = wrapped;
		this.expects = `(${wrapped.expects} | null | undefined)`;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (dataset.value === null || dataset.value === undefined) {
			// @ts-expect-error
			dataset.typed = true;

			// @ts-expect-error
			return dataset as OutputDataset<null, GqlNullishIssue>;
		}

		return this.wrapped["~run"](dataset, config) as OutputDataset<InferOutput<S>, GqlNullishIssue>;
	};
}

export function gqlNullish<const S extends GqlSchema>(wrapped: S): GqlNullishSchema<S> {
	return new GqlNullishSchema(wrapped);
}

export { gqlNullish as nullish };

export function isGqlNullish(value: unknown): value is GqlNullishSchema {
	return value instanceof GqlNullishSchema;
}

export { isGqlNullish as isNullish };
