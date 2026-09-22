import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlNumberIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "number";
}

export class GqlNumberSchema<
	const Message extends ErrorMessage<GqlNumberIssue> | undefined = undefined,
> extends GqlSchema<number, number, GqlNumberIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "number";
	public readonly expects = "number";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (typeof dataset.value === "number") {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlNumberIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<number, GqlNumberIssue>;
	};
}

export function gqlNumber(): GqlNumberSchema<undefined>;
export function gqlNumber<const Message extends ErrorMessage<GqlNumberIssue> | undefined>(
	message: Message,
): GqlNumberSchema<Message>;
export function gqlNumber(
	message?: ErrorMessage<GqlNumberIssue>,
): GqlNumberSchema<ErrorMessage<GqlNumberIssue> | undefined> {
	return new GqlNumberSchema(message);
}

export { gqlNumber as number };

export function isGqlNumber(value: unknown): value is GqlNumberSchema {
	return value instanceof GqlNumberSchema;
}

export { isGqlNumber as isNumber };
