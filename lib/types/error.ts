import type { GqlIssue } from "~/schemas/base";

export type ErrorMessage<Issue extends GqlIssue> = ((issue: Issue) => string) | string;
