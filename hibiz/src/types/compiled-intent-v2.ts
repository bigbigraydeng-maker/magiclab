/**
 * CompiledIntentV2 — v0.4 混合编译管线输出的结构化意图（LLM Compiler + 后续 Form Builder）。
 * 与 {@link CompiledIntentV1} 并存；集成阶段再写入 DB / 项目。
 */

import type { RuleGuardResult } from "@/types/rule-guard";

/** v0.4 行业 ID（与 {@link IndustryId} 的 `immigration_education` 映射见下方工具函数）。 */
export type IndustryV2 = "real_estate" | "immigration";

export type RealEstateSceneV2 = "property_listing" | "open_home_event" | "market_update";

export type ImmigrationSceneV2 = "visa_consultation" | "school_info" | "program_enrollment";

export type SceneV2 = RealEstateSceneV2 | ImmigrationSceneV2;

export type LanguageV2 = "en" | "zh" | "both";

export type PageTypeV2 = "landing" | "showcase" | "form" | "multi_section";

export type ToneV2 = "professional" | "friendly" | "urgent";

export type GoalV2 = "lead_generation" | "info_display" | "event_registration" | "consultation_booking";

export interface ModuleSelectionV2 {
  [moduleKey: string]: {
    enabled: boolean;
    priority?: "high" | "medium" | "low";
    weight?: number;
  };
}

export type FormFieldTypeV2 = "text" | "email" | "phone" | "select" | "date" | "textarea" | "checkbox";

export interface FormFieldDefinitionV2 {
  id: string;
  label: string;
  type: FormFieldTypeV2;
  required: boolean;
  placeholder?: string;
  /** Short helper under the field (optional). */
  help?: string;
  options?: Array<{ value: string; label: string }>;
}

export type CompilerVersionV2 = "rule_v1" | "hybrid_v2";

export interface CompiledIntentV2 {
  /** 持久化后填写；编译前可为空。 */
  id?: string;
  project_id?: string;

  industry: IndustryV2;
  scene: SceneV2;
  language: LanguageV2;

  page_type?: PageTypeV2;
  tone?: ToneV2;
  goal?: GoalV2;
  /** LLM 对用户意图的一句话摘要（可选）。 */
  description?: string;

  city?: string | null;
  skeleton_id?: string;
  module_selection?: ModuleSelectionV2;
  form_field_pool?: Record<string, FormFieldDefinitionV2>;
  form_field_order?: string[];

  compiler_version: CompilerVersionV2;
  rule_guard_result?: RuleGuardResult;
  user_confirmed: boolean;

  created_at: string;
  updated_at: string;
}

/** 与现有 `IndustryId` 互转（渐进集成）。 */
export function industryIdToV2(id: "immigration_education" | "real_estate"): IndustryV2 {
  return id === "real_estate" ? "real_estate" : "immigration";
}

export function industryV2ToId(ind: IndustryV2): "immigration_education" | "real_estate" {
  return ind === "real_estate" ? "real_estate" : "immigration_education";
}

const ALL_SCENES_V2: readonly string[] = [
  "property_listing",
  "open_home_event",
  "market_update",
  "visa_consultation",
  "school_info",
  "program_enrollment",
];

export function isCompiledIntentV2(v: unknown): v is CompiledIntentV2 {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  if (o.compiler_version !== "hybrid_v2") {
    return false;
  }
  if (o.industry !== "real_estate" && o.industry !== "immigration") {
    return false;
  }
  if (typeof o.scene !== "string" || !ALL_SCENES_V2.includes(o.scene)) {
    return false;
  }
  if (o.language !== "en" && o.language !== "zh" && o.language !== "both") {
    return false;
  }
  if (typeof o.created_at !== "string" || typeof o.updated_at !== "string") {
    return false;
  }
  if (typeof o.user_confirmed !== "boolean") {
    return false;
  }
  return true;
}

export function parseCompiledIntentV2(raw: unknown): CompiledIntentV2 | null {
  return isCompiledIntentV2(raw) ? raw : null;
}
