import type { GqlIssue } from "~/schemas/base";
import type { ErrorMessage } from "./error";

export interface Config<Issue extends GqlIssue> {
	readonly message?: ErrorMessage<Issue>;
	readonly abortEarly?: boolean;
	readonly abortPipeEarly?: boolean;
}
