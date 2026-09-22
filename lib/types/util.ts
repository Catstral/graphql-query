import type { SchemaLike } from "./context";

export type InferInput<T extends SchemaLike> = NonNullable<T["~/types"]>["input"];
export type InferOutput<T extends SchemaLike> = NonNullable<T["~/types"]>["output"];
export type InferIssue<T extends SchemaLike> = NonNullable<T["~/types"]>["issue"];
