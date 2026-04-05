/** Phase 1 industries (no restaurant). */
export type IndustryId = "immigration_education" | "real_estate";

export const INDUSTRIES: { id: IndustryId; label: string; description: string }[] = [
  {
    id: "immigration_education",
    label: "Immigration & education",
    description: "Assessments, bookings, seminars, program leads",
  },
  {
    id: "real_estate",
    label: "Real estate",
    description: "Open homes, buyer leads, appraisals — manual promo + poster (no listing feed)",
  },
];

export type ProjectStatus =
  | "draft"
  | "intent_drafting"
  | "intent_ready"
  | "generating"
  | "generation_failed"
  | "ready_draft"
  | "published";
