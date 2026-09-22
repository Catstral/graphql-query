import type { GqlIssue } from "~/schemas";

export interface Standard<Output, Input> {
	readonly version: 1;
	readonly vendor: "@catstral/graphql-query";
	readonly validate: (value: unknown) => StandardResult<Output>;
	readonly types?: StandardTypes<Output, Input> | undefined;
}

export interface StandardSuccessResult<Output> {
	readonly value: Output;
	readonly issues?: undefined;
}

export interface StandardFailureResult {
	readonly issues: readonly StandardIssue[];
}

export type StandardResult<Output> = StandardSuccessResult<Output> | StandardFailureResult;

export interface StandardIssue {
	readonly message: string;
	readonly path?: readonly (PropertyKey | StandardPathItem)[] | undefined;
}

export interface StandardPathItem {
	readonly key: PropertyKey;
}

export interface StandardTypes<Output, Input> {
	readonly input: Input;
	readonly output: Output;
}

export interface StandardTypesWithIssue<Output, Input, Issue extends GqlIssue> {
	readonly input: Input;
	readonly output: Output;
	readonly issue: Issue;
}
