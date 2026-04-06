/**
 * Form Builder — 基于 industry + scene 的确定性字段推荐（零 LLM 调用）。
 */

import type { FormFieldDefinitionV2, IndustryV2, SceneV2 } from "@/types/compiled-intent-v2";
import {
  FORM_FIELD_RULES,
  IMMIGRATION_FIELD_POOL_V2,
  type FormBuilderResultV2,
  REAL_ESTATE_FIELD_POOL_V2,
  UNIVERSAL_FIELD_POOL_V2,
} from "@/types/form-builder";

export function getFieldPoolForIndustry(industry: IndustryV2): Record<string, FormFieldDefinitionV2> {
  if (industry === "real_estate") {
    return REAL_ESTATE_FIELD_POOL_V2;
  }
  if (industry === "immigration") {
    return IMMIGRATION_FIELD_POOL_V2;
  }
  return UNIVERSAL_FIELD_POOL_V2;
}

export function buildFormFieldsFromRules(industry: IndustryV2, scene: SceneV2): FormBuilderResultV2 {
  const rules =
    industry === "real_estate"
      ? FORM_FIELD_RULES.real_estate[scene as keyof typeof FORM_FIELD_RULES.real_estate]
      : FORM_FIELD_RULES.immigration[scene as keyof typeof FORM_FIELD_RULES.immigration];

  if (!rules) {
    return {
      selected_fields: [UNIVERSAL_FIELD_POOL_V2.name, UNIVERSAL_FIELD_POOL_V2.email, UNIVERSAL_FIELD_POOL_V2.phone].filter(
        Boolean,
      ),
      field_order: ["name", "email", "phone"],
      groups: [{ name: "Contact", fields: ["name", "email", "phone"] }],
      confidence: 50,
      reasoning: "Unknown scene — fallback to universal contact fields.",
    };
  }

  const fieldPool = getFieldPoolForIndustry(industry);
  const selected_fields = rules.select
    .map((id) => fieldPool[id])
    .filter((f): f is FormFieldDefinitionV2 => f != null);

  return {
    selected_fields,
    field_order: [...rules.select],
    groups: rules.groups.map((g) => ({ name: g.name, fields: [...g.fields] })),
    confidence: rules.confidence,
  };
}

/** Alias for Server Actions / docs. */
export function buildFormFieldsAction(industry: IndustryV2, scene: SceneV2): FormBuilderResultV2 {
  return buildFormFieldsFromRules(industry, scene);
}
