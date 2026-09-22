import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlUndefinedIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "undefined";
}

export class GqlUndefinedSchema<
	const Message extends ErrorMessage<GqlUndefinedIssue> | undefined = undefined,
> extends GqlSchema<undefined, undefined, GqlUndefinedIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "undefined";
	public readonly expects = "undefined";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (typeof dataset.value === "undefined") {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlUndefinedIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<undefined, GqlUndefinedIssue>;
	};
}

export function gqlUndefined(): GqlUndefinedSchema<undefined>;
export function gqlUndefined<const Message extends ErrorMessage<GqlUndefinedIssue> | undefined>(
	message: Message,
): GqlUndefinedSchema<Message>;
export function gqlUndefined(
	message?: ErrorMessage<GqlUndefinedIssue>,
): GqlUndefinedSchema<ErrorMessage<GqlUndefinedIssue> | undefined> {
	return new GqlUndefinedSchema(message);
}

export { gqlUndefined as undefined };

export function isGqlUndefined(value: unknown): value is GqlUndefinedSchema {
	return value instanceof GqlUndefinedSchema;
}

export { isGqlUndefined as isUndefined };
