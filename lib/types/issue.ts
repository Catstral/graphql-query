import type { GqlIssue } from "~/schemas/base";
import type { Readonlyable } from "./helpers";

export type GqlIssueKind = "SCHEMA" | "VALIDATION" | "TRANSFORMATION";

export interface ArrayPathItem {
	readonly type: "ARRAY";
	readonly origin: "VALUE";
	readonly input: Readonlyable<unknown[]>;
	readonly key: number;
	readonly value: unknown;
}

export interface MapPathItem {
	readonly type: "MAP";
	readonly origin: "KEY" | "VALUE";
	readonly input: Map<unknown, unknown>;
	readonly key: unknown;
	readonly value: unknown;
}

export interface SetPathItem {
	readonly type: "SET";
	readonly origin: "VALUE";
	readonly input: Set<unknown>;
	readonly key: null;
	readonly value: unknown;
}

export interface ObjectPathItem {
	readonly type: "OBJECT";
	readonly origin: "KEY" | "VALUE";
	readonly input: Record<string, unknown>;
	readonly key: string;
	readonly value: unknown;
}

export interface UnknownPathItem {
	readonly type: "UNKNOWN";
	readonly origin: "KEY" | "VALUE";
	readonly input: unknown;
	readonly key: unknown;
	readonly value: unknown;
}

export type IssuePathItem = ArrayPathItem | MapPathItem | ObjectPathItem | UnknownPathItem;

export interface GqlIssueDetails<Input = unknown> {
	input: Input;
	received: string;
	message: string;
	requirement?: unknown;
	path?: [IssuePathItem, ...IssuePathItem[]];
	issues?: [GqlIssue<Input>, ...GqlIssue<Input>[]];
	abortEarly?: boolean;
	abortPipeEarly?: boolean;
}

export type IssueConstructor<Input = unknown> = new (details: GqlIssueDetails<Input>) => GqlIssue<Input>;
