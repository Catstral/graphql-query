import { GqlIssue, GqlSchema } from "~/schemas";
import type { ArrayPathItem, InferInput, InferIssue, InferOutput } from "~/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";

export class GqlArrayIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "array";
}

export class GqlArraySchema<
	const S extends GqlSchema = GqlSchema,
	const Message extends ErrorMessage<GqlArrayIssue> | undefined = undefined,
> extends GqlSchema<InferOutput<S>[], InferInput<S>[], GqlArrayIssue | InferIssue<S>> {
	public readonly kind = "SCHEMA";
	public readonly type = "array";
	public readonly expects: `Array<${S["expects"]}>`;
	public readonly item: S;
	public readonly message?: Message;

	public constructor(item: S, message?: Message) {
		super();

		this.item = item;
		this.message = message;
		this.expects = `Array<${item.expects}>`;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		const input = dataset.value;

		if (Array.isArray(input)) {
			// @ts-expect-error
			dataset.typed = true;
			dataset.value = [];

			for (let index = 0; index < input.length; index += 1) {
				const value = input[index];
				const itemDataset = this.item["~run"](
					{
						value,
					},
					config,
				);

				if (itemDataset.issues) {
					const item: ArrayPathItem = {
						type: "ARRAY",
						origin: "VALUE",
						input,
						key: index,
						value,
					};

					for (const issue of itemDataset.issues) {
						issue._prependPathItem(item);
						// @ts-expect-error
						dataset.issues?.push(issue);
					}

					if (!dataset.issues) {
						// @ts-expect-error
						dataset.issues = itemDataset.issues;
					}

					if (config.abortEarly) {
						dataset.typed = false;

						break;
					}
				}

				if (!itemDataset.typed) {
					// Make sure it is set
					dataset.typed = false;
				}

				// @ts-expect-error
				dataset.value.push(itemDataset.value);
			}
		} else {
			// @ts-expect-error
			addIssue(this, {
				label: "type",
				dataset,
				config,
				issueConstructor: GqlArrayIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<InferOutput<S>[], GqlArrayIssue | InferIssue<S>>;
	};
}

export function gqlArray<const S extends GqlSchema>(item: S): GqlArraySchema<S, undefined>;
export function gqlArray<const S extends GqlSchema, const Message extends ErrorMessage<GqlArrayIssue>>(
	item: S,
	message: Message,
): GqlArraySchema<S, Message>;
export function gqlArray(
	item: GqlSchema,
	message?: ErrorMessage<GqlArrayIssue>,
): GqlArraySchema<GqlSchema, ErrorMessage<GqlArrayIssue>> {
	return new GqlArraySchema(item, message);
}

export { gqlArray as array };

export function isGqlArray(
	value: unknown,
): value is GqlArraySchema<GqlSchema, ErrorMessage<GqlArrayIssue> | undefined> {
	return value instanceof GqlArraySchema;
}

export { isGqlArray as isArray };
