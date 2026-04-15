import { POSTER_TEMPLATES, type PosterTemplateId } from "@/data/poster-templates";

interface PosterPromptPanelProps {
  templateId: PosterTemplateId;
  /** 基于本次 TradeMe 导入内容拼好的提示词草稿，供复制到外部 LLM 微调 */
  listingDerivedPrompt?: string | null;
}

export function PosterPromptPanel({ templateId, listingDerivedPrompt }: PosterPromptPanelProps) {
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

      {listingDerivedPrompt?.trim() ? (
        <details className="mt-3 group">
          <summary className="cursor-pointer font-medium text-emerald-900 hover:underline">基于本次 TradeMe 链接的提示词建议</summary>
          <p className="mt-2 text-xs text-stone-600">
            由系统根据已抓取的标题/描述/要点自动拼接，可直接复制到 ChatGPT 等工具里继续改；不替代海报上的正式排版内容。
          </p>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-emerald-100 bg-white p-3 font-mono text-xs text-stone-800">
            {listingDerivedPrompt.trim()}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
