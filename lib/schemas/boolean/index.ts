import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlBooleanIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "boolean";
}

export class GqlBooleanSchema<
	const Message extends ErrorMessage<GqlBooleanIssue> | undefined = undefined,
> extends GqlSchema<boolean, boolean, GqlBooleanIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "boolean";
	public readonly expects = "boolean";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (typeof dataset.value === "boolean") {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlBooleanIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<boolean, GqlBooleanIssue>;
	};
}

export function gqlBoolean(): GqlBooleanSchema<undefined>;
export function gqlBoolean<const Message extends ErrorMessage<GqlBooleanIssue> | undefined>(
	message: Message,
): GqlBooleanSchema<Message>;
export function gqlBoolean(
	message?: ErrorMessage<GqlBooleanIssue>,
): GqlBooleanSchema<ErrorMessage<GqlBooleanIssue> | undefined> {
	return new GqlBooleanSchema(message);
}

export { gqlBoolean as boolean };

export function isGqlBoolean(value: unknown): value is GqlBooleanSchema {
	return value instanceof GqlBooleanSchema;
}

export { isGqlBoolean as isBoolean };
