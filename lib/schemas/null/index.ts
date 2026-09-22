import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlNullIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "null";
}

export class GqlNullSchema<const Message extends ErrorMessage<GqlNullIssue> | undefined = undefined> extends GqlSchema<
	null,
	null,
	GqlNullIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "null";
	public readonly expects = "null";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (dataset.value === null) {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlNullIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<null, GqlNullIssue>;
	};
}

export function gqlNull(): GqlNullSchema<undefined>;
export function gqlNull<const Message extends ErrorMessage<GqlNullIssue> | undefined>(
	message: Message,
): GqlNullSchema<Message>;
export function gqlNull(message?: ErrorMessage<GqlNullIssue>): GqlNullSchema<ErrorMessage<GqlNullIssue> | undefined> {
	return new GqlNullSchema(message);
}

export { gqlNull as null };

export function isGqlNull(value: unknown): value is GqlNullSchema {
	return value instanceof GqlNullSchema;
}

export { isGqlNull as isNull };
