import Link from "next/link";
import { INDUSTRIES } from "@/types/hibiz";
import { TEMPLATE_PRESETS_ALL } from "@/data/template-presets";
import { createProjectWithIntent } from "../actions";

interface NewProjectPageProps {
  searchParams: { error?: string; preset?: string };
}

export default function NewProjectPage({ searchParams }: NewProjectPageProps) {
  const preset = searchParams.preset ? TEMPLATE_PRESETS_ALL.find((p) => p.id === searchParams.preset) : undefined;

  return (
    <div>
      <Link href="/app/projects" className="text-sm text-emerald-800 hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-stone-900">New microsite</h1>
      <p className="mt-2 text-sm text-stone-600">
        Describe your page in plain English. Optional: open with a{" "}
        <code className="rounded bg-stone-100 px-1 text-xs">?preset=…</code> hint (see template list in Progress).
      </p>

      {preset ? (
        <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-950">
          Template hint: <strong>{preset.title}</strong> — {preset.summary}
        </p>
      ) : null}

      {searchParams.error === "empty_prompt" ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Please enter a short description of what you need.</p>
      ) : null}

      <form action={createProjectWithIntent} className="mt-8 max-w-xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            Project name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none ring-emerald-800 focus:ring-2"
            placeholder="e.g. Auckland open home – 12 Smith St"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-stone-700">Industry (optional)</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {INDUSTRIES.map((ind) => (
              <label
                key={ind.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
              >
                <input
                  type="radio"
                  name="industry_hint"
                  value={ind.id}
                  className="text-emerald-800"
                  defaultChecked={preset?.industry === ind.id}
                />
                {ind.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-stone-700">
            What do you need?
          </label>
          <textarea
            id="prompt"
            name="prompt"
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none ring-emerald-800 focus:ring-2"
            placeholder="Example: Open home registration page for a 3-bedroom listing in Mount Eden this Sunday 2–3pm. Collect name, phone, and email."
            defaultValue={preset?.promptHint ?? ""}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-800 py-3 text-sm font-semibold text-white hover:bg-emerald-900 sm:w-auto sm:px-8"
        >
          Save &amp; continue
        </button>
      </form>
    </div>
  );
}
