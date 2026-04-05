import type { CompiledIntentV1 } from "@/types/compiled-intent";

export interface FormFieldRow {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "multiselect";
  required: boolean;
  max_length?: number;
  options?: string[];
}

export interface FormFieldsFileV1 {
  schema_version: 1;
  version: 1;
  fields: FormFieldRow[];
}

export function isFormFieldsFileV1(data: unknown): data is FormFieldsFileV1 {
  if (!data || typeof data !== "object") {
    return false;
  }
  const o = data as Record<string, unknown>;
  return o.schema_version === 1 && o.version === 1 && Array.isArray(o.fields);
}

export function buildFormPreset(compiled: CompiledIntentV1): FormFieldsFileV1 {
  const base: FormFieldRow[] = [
    { key: "full_name", label: "Full name", placeholder: "Your name", type: "text", required: true, max_length: 120 },
    { key: "email", label: "Email", placeholder: "name@example.com", type: "email", required: true, max_length: 200 },
    { key: "phone", label: "Phone", placeholder: "NZ mobile", type: "phone", required: true, max_length: 40 },
  ];

  if (compiled.industry === "real_estate") {
    if (compiled.scene === "open_home_registration") {
      base.push({
        key: "attendee_count",
        label: "How many people attending?",
        placeholder: "e.g. 2",
        type: "text",
        required: false,
        max_length: 20,
      });
    }
    base.push({
      key: "message",
      label: "Message / questions",
      placeholder: "Optional notes",
      type: "textarea",
      required: false,
      max_length: 800,
    });
    return { schema_version: 1, version: 1, fields: base };
  }

  base.push({
    key: "message",
    label: "How can we help?",
    placeholder: "Brief background or goals",
    type: "textarea",
    required: false,
    max_length: 800,
  });
  return { schema_version: 1, version: 1, fields: base };
}
