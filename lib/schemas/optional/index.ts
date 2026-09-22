import { GqlIssue, GqlSchema } from "~/schemas";
import type { InferInput, InferOutput } from "~/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";

export class GqlOptionalIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "optional";
}

export class GqlOptionalSchema<const S extends GqlSchema = GqlSchema> extends GqlSchema<
	InferOutput<S> | undefined,
	InferInput<S> | undefined,
	GqlOptionalIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "optional";
	public readonly expects: `(${S["expects"]} | undefined)`;
	public readonly wrapped: S;

	public constructor(wrapped: S) {
		super();

		this.wrapped = wrapped;
		this.expects = `(${wrapped.expects} | undefined)`;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (dataset.value === undefined) {
			// @ts-expect-error
			dataset.typed = true;

			// @ts-expect-error
			return dataset as OutputDataset<undefined, GqlOptionalIssue>;
		}

		return this.wrapped["~run"](dataset, config) as OutputDataset<InferOutput<S>, GqlOptionalIssue>;
	};
}

export function gqlOptional<const S extends GqlSchema>(wrapped: S): GqlOptionalSchema<S> {
	return new GqlOptionalSchema(wrapped);
}

export { gqlOptional as optional };

export function isGqlOptional(value: unknown): value is GqlOptionalSchema {
	return value instanceof GqlOptionalSchema;
}

export { isGqlOptional as isOptional };
