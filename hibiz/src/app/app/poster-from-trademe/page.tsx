import Link from "next/link";
import { submitPosterFromTradeMeStandalone } from "./actions";

export const metadata = {
  title: "TradeMe → 海报（免微站）— HiBiz",
};

/** TradeMe 抓取 + 图床代理可能较慢（须放在 page，不能放在 "use server" actions 文件） */
export const maxDuration = 120;

export const dynamic = "force-dynamic";

const NOTICE_COPY: Record<string, string> = {
  no_url: "请粘贴 TradeMe 房源链接。",
  create_project_failed: "无法创建草稿项目，请稍后重试。",
  create_microsite_failed: "无法创建存储记录，请稍后重试。",
  trademe_no_url: "链接为空，请重新粘贴后再提交。",
  listing_import_fail: "未能从链接提取房源信息。请检查链接或稍后重试。",
  listing_extraction_failed: "抓取结果质量不足。请换一条链接或稍后重试。",
  merchant_no_microsite: "内部错误：未找到存储记录。请重试。",
  merchant_save_error: "保存失败，请重试。",
  listing_imported: "已生成海报素材，见下方预览；可用浏览器打印。",
  listing_imported_partial: "已导入，但部分字段偏弱；请直接看海报预览并核对。",
};

interface PosterFromTradeMePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function PosterFromTradeMePage({ searchParams }: PosterFromTradeMePageProps) {
  const noticeRaw = searchParams.notice;
  const notice = typeof noticeRaw === "string" ? noticeRaw : undefined;
  const noticeMessage = notice ? (NOTICE_COPY[notice] ?? notice) : null;
  const isError =
    notice &&
    notice !== "listing_imported" &&
    notice !== "listing_imported_partial";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-stone-900">TradeMe → 海报</h1>
      <p className="mt-2 text-sm text-stone-600">
        无需生成微站：粘贴房源链接后，我们会自动抓取要点、生成中英海报正文，并打开可打印海报页。后台会创建一个名为「TradeMe
        海报」的草稿项目用于存图与资料，你可稍后在项目列表里忽略或删除。
      </p>

      {noticeMessage ? (
        <p
          className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
            isError ? "border-amber-200 bg-amber-50 text-amber-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"
          }`}
        >
          {noticeMessage}
        </p>
      ) : null}

      <form action={submitPosterFromTradeMeStandalone} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="trademe_url" className="block text-sm font-medium text-stone-800">
            TradeMe 房源链接
          </label>
          <input
            id="trademe_url"
            name="trademe_url"
            type="url"
            required
            placeholder="https://www.trademe.co.nz/a/property/…"
            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2.5 font-mono text-sm text-stone-900 outline-none ring-emerald-800 focus:ring-2"
            maxLength={500}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-800 py-3 text-sm font-semibold text-white hover:bg-emerald-900 sm:w-auto sm:px-8"
        >
          抓取并生成海报
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        <Link href="/app/projects" className="text-emerald-800 underline hover:text-emerald-950">
          项目列表
        </Link>
      </p>
    </div>
  );
}
