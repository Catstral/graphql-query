import type { GqlIssue } from "~/schemas";
import type { Config } from "~/types/config";
import type { SchemaLike } from "~/types/context";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import type { GqlIssueDetails, IssueConstructor, IssuePathItem } from "~/types/issue";
import type { InferInput, InferIssue } from "~/types/util";

export interface Other<S extends SchemaLike> {
	input?: unknown;
	expected?: string;
	received?: string;
	message?: ErrorMessage<InferIssue<S>>;
	path?: [IssuePathItem, ...IssuePathItem[]];
	issues?: [GqlIssue<InferInput<S>>, ...GqlIssue<InferInput<S>>[]];
}

export interface AddIssueDetails<S extends SchemaLike> {
	label: string;
	dataset: UnknownDataset | OutputDataset;
	config: Config<InferIssue<S>>;
	issueConstructor: IssueConstructor;
	other?: Other<S>;
}

export function addIssue<const S extends SchemaLike>(
	context: S & {
		expects?: string | null;
		requirement?: unknown;
		message?: ErrorMessage<InferIssue<S>>;
	},
	{ label, dataset, config, other, issueConstructor }: AddIssueDetails<S>,
) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? stringify(input);

	let issueMessage = `Invalid ${label}: `;

	if (expected) {
		issueMessage += `Expected ${expected} but received`;
	} else {
		issueMessage += "Received";
	}

	issueMessage += ` ${received}`;

	const messagelessDetails: Omit<GqlIssueDetails<unknown>, "message"> = {
		input,
		received: received,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
	};

	const messageOverride: ErrorMessage<InferIssue<S>> | undefined = other?.message ?? context.message ?? config.message;

	let issue: GqlIssue;

	if (typeof messageOverride === "function") {
		issue = new issueConstructor({
			...messagelessDetails,
			message: messageOverride(
				new issueConstructor({
					...messagelessDetails,
					message: issueMessage,
				}),
			),
		});
	} else {
		issue = new issueConstructor({
			...messagelessDetails,
			message: messageOverride ?? issueMessage,
		});
	}

	if (context.kind === "SCHEMA") {
		dataset.typed = false;
	}

	if (dataset.issues) {
		dataset.issues.push(issue);
	} else {
		// @ts-expect-error
		dataset.issues = [issue];
	}
}

export function stringify(value: unknown): string {
	const type = typeof value;

	if (type === "string") {
		return `"${value}"`;
	}

	if (type === "number" || type === "boolean") {
		return `${value}`;
	}

	if (type === "bigint") {
		return `${value}n`;
	}

	if (type === "object" || type === "function") {
		return (value && Object.getPrototypeOf(value)?.constructor?.name) ?? "null";
	}

	return type;
}
