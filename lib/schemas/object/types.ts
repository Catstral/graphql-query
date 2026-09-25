import type { InferInput, InferIssue, InferOutput } from "~/types";
import type { SchemaLike } from "~/types/context";

export type ObjectEntries = Record<string, SchemaLike>;
export type InferObjectInput<T extends ObjectEntries> = {
	-readonly [K in keyof T]: InferInput<T[K]>;
};
export type InferObjectOutput<T extends ObjectEntries> = {
	-readonly [K in keyof T]: InferOutput<T[K]>;
};
export type InferObjectIssue<T extends ObjectEntries> = InferIssue<T[keyof T]>;
