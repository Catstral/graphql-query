import type { Standard, StandardTypesWithIssue } from "~/standard/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { GqlIssueDetails, GqlIssueKind, IssuePathItem } from "~/types/issue";
import type { GqlSchemaKind } from "~/types/schema";

export abstract class GqlIssue<const Input = unknown> implements Config<GqlIssue<Input>> {
	public abstract readonly kind: GqlIssueKind;
	public abstract readonly expected: string | null;

	public readonly input: Input;
	public readonly received: string;
	public readonly message: string;
	public readonly requirement?: unknown;
	public readonly path?: [IssuePathItem, ...IssuePathItem[]];
	public readonly issues?: [GqlIssue<Input>, ...GqlIssue<Input>[]];
	public readonly abortEarly: boolean;
	public readonly abortPipeEarly: boolean;

	public constructor({
		input,
		received,
		message,
		requirement,
		path,
		issues,
		abortEarly,
		abortPipeEarly,
	}: GqlIssueDetails<Input>) {
		this.input = input;
		this.received = received;
		this.message = message;
		this.requirement = requirement;
		this.path = path;
		this.issues = issues;
		this.abortEarly = abortEarly ?? false;
		this.abortPipeEarly = abortPipeEarly ?? false;
	}
}

export abstract class GqlSchema<
	const Output = unknown,
	const Input = unknown,
	const Issue extends GqlIssue = GqlIssue,
> {
	public abstract readonly kind: GqlSchemaKind;
	public abstract readonly type: string;
	public abstract readonly expects: string;
	public abstract readonly "~run": (dataset: UnknownDataset, config: Config<GqlIssue>) => OutputDataset<Output, Issue>;

	public readonly "~standard": Standard<Output, Input>;
	// NOTE: this is for type inferral, this is never actually set
	public readonly "~/types"?: StandardTypesWithIssue<Output, Input, Issue>;

	public constructor() {
		this["~standard"] = {
			version: 1,
			vendor: "@catstral/graphql-query",
			// @ts-expect-error
			validate: (value) => {
				return this["~run"](
					{
						value,
					},
					{},
				);
			},
		};
	}
}
