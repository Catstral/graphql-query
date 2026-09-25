import { GqlIssue, GqlSchema } from "~/schemas";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";
import type { PicklistOption, PicklistOptions } from "./types";

export * from "./types";

type _ExpendedPicklistOptions<R extends PicklistOptions> = R extends [
	infer V extends PicklistOption,
	...infer Rest extends [PicklistOption, ...PicklistOption[]],
]
	? `${V} | ${_ExpendedPicklistOptions<Rest>}`
	: R extends [infer V extends PicklistOption]
		? `${V}`
		: "";

export class GqlPicklistIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "picklist";
}

export class GqlPicklistSchema<
	const O extends PicklistOptions = PicklistOptions,
	const Message extends ErrorMessage<GqlPicklistIssue> | undefined = undefined,
> extends GqlSchema<O[number], O[number], GqlPicklistIssue> {
	public readonly kind = "SCHEMA";
	public readonly type = "picklist";
	public readonly expects: `( ${_ExpendedPicklistOptions<O>} )`;
	public readonly message?: Message;
	public readonly list: O;

	public constructor(list: O, message?: Message) {
		super();

		this.list = list;
		this.expects = `( ${list.map((item) => item.toString()).join(" | ") as _ExpendedPicklistOptions<O>} )`;
		this.message = message;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		if (this.list.includes(dataset.value as O[number])) {
			// @ts-expect-error
			dataset.typed = true;
		} else {
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlPicklistIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<O[number], GqlPicklistIssue>;
	};
}

export function gqlPicklist<const O extends PicklistOptions>(list: O): GqlPicklistSchema<O, undefined>;
export function gqlPicklist<
	const O extends PicklistOptions,
	const Message extends ErrorMessage<GqlPicklistIssue> | undefined,
>(list: O, message: Message): GqlPicklistSchema<O, Message>;
export function gqlPicklist(
	list: PicklistOptions,
	message?: ErrorMessage<GqlPicklistIssue>,
): GqlPicklistSchema<PicklistOptions, ErrorMessage<GqlPicklistIssue> | undefined> {
	return new GqlPicklistSchema(list, message);
}

export { gqlPicklist as picklist };

export function isGqlPicklist(
	value: unknown,
): value is GqlPicklistSchema<PicklistOptions, ErrorMessage<GqlPicklistIssue> | undefined> {
	return value instanceof GqlPicklistSchema;
}

export { isGqlPicklist as isPicklist };
