import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlBigIntIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "bigInt";
}

export class GqlBigIntSchema<
	const Message extends ErrorMessage<GqlBigIntIssue> | undefined = undefined,
> extends GqlSchema<bigint, bigint, GqlBigIntIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "bigint";
	public readonly expects = "bigInt";
	public readonly message?: Message;

	public constructor(message?: Message) {
		super();

		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (typeof dataset.value === "bigint") {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlBigIntIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<bigint, GqlBigIntIssue>;
	};
}

export function gqlBigInt(): GqlBigIntSchema<undefined>;
export function gqlBigInt<const Message extends ErrorMessage<GqlBigIntIssue> | undefined>(
	message: Message,
): GqlBigIntSchema<Message>;
export function gqlBigInt(
	message?: ErrorMessage<GqlBigIntIssue>,
): GqlBigIntSchema<ErrorMessage<GqlBigIntIssue> | undefined> {
	return new GqlBigIntSchema(message);
}

export { gqlBigInt as bigInt };

export function isGqlBigInt(value: unknown): value is GqlBigIntSchema {
	return value instanceof GqlBigIntSchema;
}

export { isGqlBigInt as isBigInt };
