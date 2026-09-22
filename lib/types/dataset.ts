import type { GqlIssue } from "~/schemas/base";

export interface UnknownDataset {
	typed?: false;
	value: unknown;
	issues?: undefined;
}

export interface SuccessDataset<T> {
	typed: true;
	value: T;
	issues?: undefined;
}

export interface PartialDataset<T = unknown, Issue extends GqlIssue = GqlIssue> {
	typed: true;
	value: T;
	issues: [Issue, ...Issue[]];
}

export interface FailureDataset<Issue extends GqlIssue = GqlIssue> {
	typed: false;
	value: unknown;
	issues: [Issue, ...Issue[]];
}

export type OutputDataset<T = unknown, Issue extends GqlIssue = GqlIssue> =
	| SuccessDataset<T>
	| PartialDataset<T, Issue>
	| FailureDataset<Issue>;
