import { POSTER_TEMPLATES, type PosterTemplateId } from "@/data/poster-templates";

interface PosterPromptPanelProps {
  templateId: PosterTemplateId;
}

export function PosterPromptPanel({ templateId }: PosterPromptPanelProps) {
  const meta = POSTER_TEMPLATES.find((t) => t.id === templateId) ?? POSTER_TEMPLATES[0];

  return (
    <div className="poster-no-print mt-8 max-w-2xl rounded-xl border border-stone-200 bg-stone-50/90 p-5 text-sm text-stone-800">
      <h3 className="font-display text-base font-semibold text-stone-900">配套提示词 · {meta.title}</h3>
      <p className="mt-2 text-xs text-stone-600">{meta.designNote}</p>

      <details className="mt-4 group">
        <summary className="cursor-pointer font-medium text-emerald-900 hover:underline">给商家的文案要点</summary>
        <p className="mt-2 rounded-lg border border-stone-200 bg-white p-3 text-sm leading-relaxed text-stone-700">
          {meta.merchantCopyGuide}
        </p>
      </details>

      <details className="mt-3 group">
        <summary className="cursor-pointer font-medium text-emerald-900 hover:underline">给 LLM 的提示片段（整段复制）</summary>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-stone-200 bg-white p-3 font-mono text-xs text-stone-800">
          {meta.llmPromptSnippet}
        </pre>
      </details>
    </div>
  );
}
