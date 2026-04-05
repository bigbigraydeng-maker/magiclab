import type { Metadata } from "next";
import {
  DEV_PROGRESS_LAST_UPDATED,
  DEV_PROGRESS_PHASES,
  overallCompletion,
  phaseCompletion,
  type ItemStatus,
} from "@/data/dev-progress";

export const metadata: Metadata = {
  title: "开发进度 — HiBiz",
  description: "HiBiz MVP 阶段进度与待办（内部看板）",
};

function statusLabel(s: ItemStatus): string {
  switch (s) {
    case "done":
      return "已完成";
    case "in_progress":
      return "进行中";
    case "blocked":
      return "阻塞";
    default:
      return "待办";
  }
}

function statusStyles(s: ItemStatus): string {
  switch (s) {
    case "done":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-950";
    case "blocked":
      return "border-red-200 bg-red-50 text-red-900";
    default:
      return "border-stone-200 bg-stone-50 text-stone-600";
  }
}

export default function ProgressPage() {
  const overall = overallCompletion(DEV_PROGRESS_PHASES);

  return (
    <div className="min-h-screen bg-[#f4f0ea] text-stone-900">
      <div
        className="border-b border-stone-200/80 bg-[#1c1917] px-4 py-14 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, #1c1917 0%, #14532d 48%, #0f172a 100%)`,
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/90">HiBiz · internal</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">开发进度</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-300">
            可视看板与 Obsidian 规格同步；条目与权重以{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-emerald-200">src/data/dev-progress.ts</code> 为准。
          </p>
          <p className="mt-6 text-sm text-stone-400">最后更新 · {DEV_PROGRESS_LAST_UPDATED}</p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-300">整体完成度（加权）</p>
                <p className="mt-1 font-display text-5xl font-semibold text-white tabular-nums">{overall.pct}%</p>
              </div>
              <p className="text-sm text-stone-400">
                已完成条目 <span className="font-medium text-stone-200">{overall.done}</span> / {overall.total}
              </p>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 transition-[width] duration-700 ease-out"
                style={{ width: `${overall.pct}%` }}
              />
            </div>
            <dl className="mt-4 flex flex-wrap gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                已完成
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                进行中（按 55% 计）
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-stone-400" />
                待办 / 阻塞
              </div>
            </dl>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <ol className="space-y-10">
          {DEV_PROGRESS_PHASES.map((phase, idx) => {
            const { pct, done, total } = phaseCompletion(phase.items);
            return (
              <li key={phase.id}>
                <div className="flex gap-4">
                  <div className="flex w-10 shrink-0 flex-col items-center pt-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-900 bg-white font-display text-lg font-semibold text-stone-900 shadow-sm">
                      {idx + 1}
                    </span>
                    {idx < DEV_PROGRESS_PHASES.length - 1 ? (
                      <span className="mt-2 w-px flex-1 min-h-[2rem] bg-gradient-to-b from-stone-400 to-transparent" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl font-semibold text-stone-900">{phase.title}</h2>
                        <p className="mt-1 text-sm text-stone-500">{phase.summary}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl font-semibold tabular-nums text-emerald-900">{pct}%</p>
                        <p className="text-xs text-stone-500">
                          {done}/{total} 项已完成
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <ul className="mt-6 space-y-3">
                      {phase.items.map((item) => (
                        <li
                          key={item.id}
                          className={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-sm ${statusStyles(item.status)}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium leading-snug">{item.label}</span>
                            <span className="shrink-0 rounded-full border border-current/20 bg-white/40 px-2 py-0.5 text-xs font-medium">
                              {statusLabel(item.status)}
                            </span>
                          </div>
                          {item.note ? <p className="text-xs opacity-90">{item.note}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <footer className="mt-14 border-t border-stone-200 pt-8 text-center text-xs text-stone-500">
          <p>与本页同步的 Obsidian 文档：Second-Brain → 01-Magiclab → Projects → HiBiz → 「10-开发进度」</p>
        </footer>
      </main>
    </div>
  );
}
