import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlDateIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "date";
}

export class GqlDateSchema<const Message extends ErrorMessage<GqlDateIssue> | undefined = undefined> extends GqlSchema<
	Date,
	Date,
	GqlDateIssue
> {
	public readonly kind = "SCHEMA";
	public readonly type = "date";
	public readonly expects = "Date";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (dataset.value instanceof Date) {
			if (!Number.isNaN(dataset.value.valueOf())) {
				// @ts-expect-error
				dataset.typed = true;
			} else {
				addIssue(this, {
					label: "type",
					config,
					dataset,
					issueConstructor: GqlDateIssue,
					other: {
						received: "invalid Date",
					},
				});
			}
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlDateIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<Date, GqlDateIssue>;
	};
}

export function gqlDate(): GqlDateSchema<undefined>;
export function gqlDate<const Message extends ErrorMessage<GqlDateIssue> | undefined>(
	message: Message,
): GqlDateSchema<Message>;
export function gqlDate(message?: ErrorMessage<GqlDateIssue>): GqlDateSchema<ErrorMessage<GqlDateIssue> | undefined> {
	return new GqlDateSchema(message);
}

export { gqlDate as date };

export function isGqlDate(value: unknown): value is GqlDateSchema {
	return value instanceof GqlDateSchema;
}

export { isGqlDate as isDate };
