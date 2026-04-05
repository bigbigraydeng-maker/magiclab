"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { importListingFromUrl } from "../merchant-profile-actions";

interface ImportTradeMeButtonProps {
  projectId: string;
  /** 与 TradeMe 输入框的 id 一致，用于读取未保存的链接 */
  trademeInputId: string;
}

function isNextRedirectError(e: unknown): boolean {
  if (!e || typeof e !== "object") {
    return false;
  }
  const d = (e as { digest?: unknown }).digest;
  return typeof d === "string" && d.includes("NEXT_REDIRECT");
}

export function ImportTradeMeButton({ projectId, trademeInputId }: ImportTradeMeButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const el = document.getElementById(trademeInputId);
        const raw = el instanceof HTMLInputElement ? el.value : "";
        const override = raw.trim() ? raw : undefined;
        startTransition(async () => {
          try {
            await importListingFromUrl(projectId, override);
          } catch (e: unknown) {
            if (isNextRedirectError(e)) {
              throw e;
            }
            console.error(e);
            router.refresh();
          }
        });
      }}
      className="rounded-lg border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "导入中…" : "从链接导入房源信息"}
    </button>
  );
}
