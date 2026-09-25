import { GqlIssue, GqlSchema } from "~/schemas";
import type { ObjectPathItem } from "~/types";
import type { Config } from "~/types/config";
import type { OutputDataset, UnknownDataset } from "~/types/dataset";
import type { ErrorMessage } from "~/types/error";
import { addIssue } from "~/utils";
import type { InferObjectInput, InferObjectIssue, InferObjectOutput, ObjectEntries } from "./types";

export * from "./types";

export class GqlObjectIssue extends GqlIssue<unknown> {
	public readonly kind = "SCHEMA";
	public readonly expected = "object";
}

export class GqlObjectSchema<
	const S extends ObjectEntries = ObjectEntries,
	const Message extends ErrorMessage<GqlObjectIssue> | undefined = undefined,
> extends GqlSchema<InferObjectOutput<S>, InferObjectInput<S>, GqlObjectIssue | InferObjectIssue<S>> {
	public readonly kind = "SCHEMA";
	public readonly type = "object";
	public readonly expects: `Object { ${string} }`; // NOTE: The sub type for this cannot be defined in types without messing with the generic
	public readonly mask: S;
	public readonly message?: Message;

	public constructor(mask: S, message?: Message) {
		super();

		this.mask = mask;
		this.message = message;

		const objectDescriptor = Object.entries(mask)
			.map(([key, schema]) => `${key}: ${schema.expects}`)
			.join(", ");

		this.expects = `Object { ${objectDescriptor} }`;
	}

	public readonly "~run" = (dataset: UnknownDataset, config: Config<GqlIssue>) => {
		const input = dataset.value;

		if (input && typeof input === "object" && !Array.isArray(input)) {
			// @ts-expect-error
			dataset.typed = true;
			dataset.value = {};

			for (const [key, schema] of Object.entries(this.mask)) {
				if (key in input || schema.type === "optional" || schema.type === "nullish") {
					// @ts-expect-error
					const value = input[key];
					const valueDataset = schema["~run"](
						{
							value,
						},
						config,
					);

					if (valueDataset.issues) {
						const item: ObjectPathItem = {
							type: "OBJECT",
							origin: "VALUE",
							input: input as Record<string, unknown>,
							key,
							value,
						};

						for (const issue of valueDataset.issues) {
							issue._prependPathItem(item);
						}

						if (!dataset.issues) {
							// @ts-expect-error
							dataset.issues = valueDataset.issues;
						}

						if (config.abortEarly) {
							dataset.typed = false;

							break;
						}

						if (!valueDataset.typed) {
							dataset.typed = false;
						}

						// @ts-expect-error
						dataset.value[key] = valueDataset.value;
					}
				} else {
					// @ts-expect-error
					addIssue(this, {
						label: "key",
						config,
						dataset,
						other: {
							input: undefined,
							expected: `"${key}"`,
							path: [
								{
									type: "OBJECT",
									origin: "KEY",
									input,
									key,
									// @ts-expect-error
									value: input[key],
								},
							],
						},
					});

					if (config.abortEarly) {
						break;
					}
				}
			}
		} else {
			// @ts-expect-error
			addIssue(this, {
				label: "type",
				config,
				dataset,
				issueConstructor: GqlObjectIssue,
			});
		}

		// @ts-expect-error
		return dataset as OutputDataset<InferObjectOutput<S>, GqlObjectIssue | InferObjectIssue<S>>;
	};
}

export function gqlObject<const S extends ObjectEntries>(mask: S): GqlObjectSchema<S, undefined>;
export function gqlObject<const S extends ObjectEntries, const Message extends ErrorMessage<GqlObjectIssue>>(
	mask: S,
	message: Message,
): GqlObjectSchema<S, Message>;
export function gqlObject(
	mask: ObjectEntries,
	message?: ErrorMessage<GqlObjectIssue>,
): GqlObjectSchema<ObjectEntries, ErrorMessage<GqlObjectIssue>> {
	return new GqlObjectSchema(mask, message);
}

export { gqlObject as object };

export function isGqlObject(
	value: unknown,
): value is GqlObjectSchema<ObjectEntries, ErrorMessage<GqlObjectIssue> | undefined> {
	return value instanceof GqlObjectSchema;
}

export { isGqlObject as isObject };
