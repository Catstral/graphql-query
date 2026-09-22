import type { GqlSchema } from "./schemas";
import type { InferIssue } from "./types";

export class GqlSchemaError<S extends GqlSchema> extends Error {
	public readonly issues: [InferIssue<S>, ...InferIssue<S>[]];

	public constructor(issues: [InferIssue<S>, ...InferIssue<S>[]]) {
		super(issues[0].message);

		this.name = "GqlSchemaError";
		this.issues = issues;
	}
}
