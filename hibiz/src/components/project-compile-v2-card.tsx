"use client";

import { useMemo, useState, useTransition } from "react";
import { compileIntentV2Action, confirmIntentV2Action } from "@/app/app/projects/compile-intent-v2-action";
import { buildFormFieldsFromRules } from "@/lib/generation/llm-form-builder";
import type { FormBuilderResultV2 } from "@/types/form-builder";
import type {
  CompiledIntentV2,
  ImmigrationSceneV2,
  IndustryV2,
  RealEstateSceneV2,
  SceneV2,
} from "@/types/compiled-intent-v2";

export interface ProjectCompileV2CardProps {
  projectId: string;
  rawPrompt: string;
  savedIntent: CompiledIntentV2 | null;
}

const REAL_SCENES: { value: RealEstateSceneV2; label: string }[] = [
  { value: "property_listing", label: "property_listing" },
  { value: "open_home_event", label: "open_home_event" },
  { value: "market_update", label: "market_update" },
];

const IMM_SCENES: { value: ImmigrationSceneV2; label: string }[] = [
  { value: "visa_consultation", label: "visa_consultation" },
  { value: "school_info", label: "school_info" },
  { value: "program_enrollment", label: "program_enrollment" },
];

function scenesForIndustry(ind: IndustryV2): { value: SceneV2; label: string }[] {
  return ind === "real_estate" ? REAL_SCENES : IMM_SCENES;
}

function defaultSceneForIndustry(ind: IndustryV2): SceneV2 {
  return ind === "real_estate" ? "property_listing" : "visa_consultation";
}

export function ProjectCompileV2Card({ projectId, rawPrompt, savedIntent }: ProjectCompileV2CardProps) {
  const [intent, setIntent] = useState<CompiledIntentV2 | null>(null);
  const [formFields, setFormFields] = useState<FormBuilderResultV2 | null>(null);
  const [costCents, setCostCents] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [pendingIndustry, setPendingIndustry] = useState<IndustryV2 | null>(null);
  const [pendingScene, setPendingScene] = useState<SceneV2 | null>(null);
  const [pending, startTransition] = useTransition();

  const displayIntent = intent ?? savedIntent;

  const derivedFields = useMemo(() => {
    if (editMode && pendingIndustry && pendingScene) {
      return buildFormFieldsFromRules(pendingIndustry, pendingScene);
    }
    if (formFields) {
      return formFields;
    }
    if (savedIntent) {
      return buildFormFieldsFromRules(savedIntent.industry, savedIntent.scene);
    }
    return null;
  }, [editMode, pendingIndustry, pendingScene, formFields, savedIntent]);

  const effectiveConfirmed = Boolean(intent?.user_confirmed ?? savedIntent?.user_confirmed);

  const pendingDirty =
    editMode &&
    pendingIndustry &&
    pendingScene &&
    displayIntent &&
    (pendingIndustry !== displayIntent.industry || pendingScene !== displayIntent.scene);

  const showConfirm = Boolean(
    displayIntent && (!effectiveConfirmed || Boolean(pendingDirty)) && (intent ?? savedIntent),
  );

  const handleCompile = () => {
    setError(null);
    setSaveMessage(null);
    startTransition(async () => {
      try {
        const res = await compileIntentV2Action(rawPrompt, projectId);
        setIntent(res.intent);
        setFormFields(res.formFields);
        setCostCents(res.costCents);
        setPendingIndustry(res.intent.industry);
        setPendingScene(res.intent.scene);
        setEditMode(false);
      } catch (e) {
        setIntent(null);
        setFormFields(null);
        setCostCents(null);
        setError(e instanceof Error ? e.message : "Compilation failed.");
      }
    });
  };

  const openEdit = () => {
    if (!displayIntent) {
      return;
    }
    setSaveMessage(null);
    setEditMode(true);
    setPendingIndustry(displayIntent.industry);
    setPendingScene(displayIntent.scene);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setPendingIndustry(null);
    setPendingScene(null);
  };

  const handleConfirm = () => {
    const base = intent ?? savedIntent;
    if (!base) {
      return;
    }
    setError(null);
    setSaveMessage(null);
    startTransition(async () => {
      try {
        const ind = pendingIndustry ?? base.industry;
        const sc = pendingScene ?? base.scene;
        const merged: CompiledIntentV2 = {
          ...base,
          industry: ind,
          scene: sc,
        };
        await confirmIntentV2Action(projectId, merged);
        setIntent({ ...merged, user_confirmed: true });
        setEditMode(false);
        setPendingIndustry(null);
        setPendingScene(null);
        setSaveMessage("已保存到项目。可在下方使用「生成网站草稿」。");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  };

  const onIndustryChange = (value: IndustryV2) => {
    setPendingIndustry(value);
    setPendingScene((prev) => {
      const cur = prev ?? defaultSceneForIndustry(value);
      return scenesForIndustry(value).some((s) => s.value === cur) ? cur : defaultSceneForIndustry(value);
    });
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900">Compile v0.4 Hybrid</h2>
          <p className="mt-1 text-xs text-stone-600">Rule Guard → LLM 意图 → 规则推荐表单字段（本卡片不生成网站草稿）</p>
        </div>
        <div className="text-right text-xs text-stone-500">
          <p className="font-medium text-indigo-700">需要 OPENAI_API_KEY</p>
          <p>~$0.01 / 次编译</p>
        </div>
      </div>

      {!rawPrompt.trim() ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">请先在下方 Intent 中填写原始描述，再回到此处编译。</p>
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => handleCompile()}
            className="w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "正在编译…" : "运行混合编译"}
          </button>
          {costCents != null ? (
            <p className="mt-2 text-center text-xs text-stone-500">预估费用 ~${(costCents / 100).toFixed(2)}</p>
          ) : null}
        </div>
      )}

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      {saveMessage ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {saveMessage}
        </div>
      ) : null}

      {displayIntent && !error ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-stone-500">编译结果</p>

            {!editMode ? (
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-stone-500">Industry</p>
                  <p className="font-semibold text-stone-900">{displayIntent.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Scene</p>
                  <p className="font-semibold text-stone-900">{displayIntent.scene}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Language</p>
                  <p className="font-semibold text-stone-900">{displayIntent.language}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">保存状态</p>
                  <p className={`font-semibold ${effectiveConfirmed ? "text-emerald-700" : "text-amber-700"}`}>
                    {effectiveConfirmed ? "已确认" : "未确认"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hibiz-pending-industry" className="text-xs font-medium text-stone-600">
                    Industry
                  </label>
                  <select
                    id="hibiz-pending-industry"
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    value={pendingIndustry ?? displayIntent.industry}
                    onChange={(e) => onIndustryChange(e.target.value as IndustryV2)}
                  >
                    <option value="real_estate">real_estate</option>
                    <option value="immigration">immigration</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hibiz-pending-scene" className="text-xs font-medium text-stone-600">
                    Scene
                  </label>
                  <select
                    id="hibiz-pending-scene"
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    value={pendingScene ?? displayIntent.scene}
                    onChange={(e) => setPendingScene(e.target.value as SceneV2)}
                  >
                    {scenesForIndustry(pendingIndustry ?? displayIntent.industry).map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending || !rawPrompt.trim()}
                    onClick={() => handleCompile()}
                    className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    重新编译（LLM）
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelEdit()}
                    className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    取消编辑
                  </button>
                </div>
              </div>
            )}

            {displayIntent && !editMode ? (
              <button
                type="button"
                onClick={() => openEdit()}
                className="mt-4 text-sm font-medium text-indigo-800 underline hover:text-indigo-950"
              >
                编辑 industry / scene
              </button>
            ) : null}
          </div>

          {derivedFields ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <p className="mb-2 text-sm font-semibold text-blue-950">
                推荐表单字段（{derivedFields.confidence}%）· {derivedFields.selected_fields.length} 个
              </p>
              <ul className="flex flex-wrap gap-2">
                {derivedFields.selected_fields.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-900"
                  >
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {showConfirm ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => handleConfirm()}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {pending ? "保存中…" : "确认并保存到项目"}
            </button>
          ) : null}

          {effectiveConfirmed && !editMode && !pendingDirty ? (
            <p className="text-center text-sm text-emerald-800">意图已确认。请使用下方「生成网站草稿」继续。</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
