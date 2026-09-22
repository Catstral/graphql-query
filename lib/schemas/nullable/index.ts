import { GqlIssue, GqlSchema } from "~/schemas";
import type { InferInput, InferOutput } from "~/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";

export class GqlNullableIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "nullable";
}

export class GqlNullableSchema<const S extends GqlSchema = GqlSchema> extends GqlSchema<
	InferOutput<S> | null,
	InferInput<S> | null,
	GqlNullableIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "nullable";
	public readonly expects: `(${S["expects"]} | null)`;
	public readonly wrapped: S;

	public constructor(wrapped: S) {
		super();

		this.wrapped = wrapped;
		this.expects = `(${wrapped.expects} | null)`;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (dataset.value === null) {
			// @ts-expect-error
			dataset.typed = true;

			// @ts-expect-error
			return dataset as OutputDataset<null, GqlNullableIssue>;
		}

		return this.wrapped["~run"](dataset, config) as OutputDataset<InferOutput<S>, GqlNullableIssue>;
	};
}

export function gqlNullable<const S extends GqlSchema>(wrapped: S): GqlNullableSchema<S> {
	return new GqlNullableSchema(wrapped);
}

export { gqlNullable as nullable };

export function isGqlNullable(value: unknown): value is GqlNullableSchema {
	return value instanceof GqlNullableSchema;
}

export { isGqlNullable as isNullable };
