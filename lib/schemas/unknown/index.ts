import { GqlIssue, GqlSchema } from "~/schemas";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";

export class GqlUnkownIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "unknown";
}

export class GqlUnknownSchema extends GqlSchema<unknown, unknown, GqlUnkownIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "unknown";
	public readonly expects = "unknown";

	public readonly "~run" = (dataset: UnknownDataset) => {
		// @ts-expect-error
		dataset.typed = true;

		// @ts-expect-error
		return dataset as OutputDataset<unknown, GqlUnkownIssue>;
	};
}

export function gqlUnknown(): GqlUnknownSchema {
	return new GqlUnknownSchema();
}

export { gqlUnknown as unknown };

export function isGqlUnknown(value: unknown): value is GqlUnknownSchema {
	return value instanceof GqlUnknownSchema;
}

export { isGqlUnknown as isUnknown };
