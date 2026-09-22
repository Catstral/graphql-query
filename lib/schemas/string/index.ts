import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlStringIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "string";
}

export class GqlStringSchema<
	const Message extends ErrorMessage<GqlStringIssue> | undefined = undefined,
> extends GqlSchema<string, string, GqlStringIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "string";
	public readonly expects = "string";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (typeof dataset.value === "string") {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlStringIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<string, GqlStringIssue>;
	};
}

export function gqlString(): GqlStringSchema<undefined>;
export function gqlString<const Message extends ErrorMessage<GqlStringIssue> | undefined>(
	message: Message,
): GqlStringSchema<Message>;
export function gqlString(
	message?: ErrorMessage<GqlStringIssue>,
): GqlStringSchema<ErrorMessage<GqlStringIssue> | undefined> {
	return new GqlStringSchema(message);
}

export { gqlString as string };

export function isGqlString(value: unknown): value is GqlStringSchema {
	return value instanceof GqlStringSchema;
}

export { isGqlString as isString };
