import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePosterTemplateId } from "@/data/poster-templates";
import { listingUrlToQrDataUrl } from "@/lib/poster/qr";
import { collectPosterImageUrls } from "@/lib/merchant-profile/poster-images";
import { buildPosterContactFromProfile } from "@/lib/generation/skeleton-fill";
import { parseMerchantProfile, type PropertyPromoV1 } from "@/types/merchant-profile";
import { PosterDesignedLayout } from "@/components/poster/PosterDesignedLayout";
import { PosterPromptPanel } from "@/components/poster/PosterPromptPanel";
import { PosterPrintBar } from "./poster-print-bar";

function resolvePosterBody(promo: PropertyPromoV1 | undefined): string {
  if (!promo) {
    return "";
  }
  const loc = promo.poster_locale === "en" ? "en" : "zh";
  const raw = promo.details?.trim() ?? "";
  if (loc === "en") {
    return (promo.poster_blurb_en?.trim() || raw).slice(0, 4000);
  }
  return (promo.poster_blurb_zh?.trim() || raw).slice(0, 4000);
}

interface PosterPageProps {
  params: { id: string };
}

export const metadata = {
  title: "Promotion poster — HiBiz",
};

export default async function PosterPage({ params }: PosterPageProps) {
  const supabase = createClient();
  const { data: project, error: pErr } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", params.id)
    .maybeSingle();

  if (pErr || !project) {
    notFound();
  }

  const { data: ms, error: mErr } = await supabase
    .from("microsites")
    .select("merchant_profile")
    .eq("project_id", params.id)
    .maybeSingle();

  if (mErr || !ms) {
    notFound();
  }

  const mp = parseMerchantProfile(ms.merchant_profile);
  const promo = mp?.property_promo;
  const contact = mp?.contact;
  const posterContact = mp ? buildPosterContactFromProfile(mp) : null;
  const templateId = normalizePosterTemplateId(promo?.poster_template_id);
  const headline = promo?.headline?.trim() || project.name;
  const posterBody = resolvePosterBody(promo);
  const trademe = promo?.trademe_url?.trim() ?? null;
  const imageUrls = collectPosterImageUrls(promo);
  const listingAgentName = promo?.listing_agent_name?.trim() ?? posterContact?.name?.trim() ?? null;
  const listingAgentCompany = promo?.listing_agent_company?.trim() ?? null;
  const listingAgentPhotoUrl = promo?.listing_agent_photo_url?.trim() ?? null;
  const listingAgentPhone = promo?.listing_agent_phone?.trim() || contact?.phone?.trim() || null;

  let listingQrDataUrl: string | null = null;
  if (trademe?.startsWith("http://") || trademe?.startsWith("https://")) {
    try {
      listingQrDataUrl = await listingUrlToQrDataUrl(trademe);
    } catch {
      listingQrDataUrl = null;
    }
  }

  return (
    <div>
      <div className="poster-no-print mb-6">
        <Link href={`/app/projects/${project.id}`} className="text-sm text-emerald-800 hover:underline">
          ← {project.name}
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-stone-900">Promotion poster</h1>
        <p className="mt-1 max-w-xl text-sm text-stone-600">
          海报正文优先显示「导入」生成的中英摘要（可在项目页切换语言）；Trade Me 链接以二维码展示，不印明文。主图 URL 优先，其次为导入缓存图。
        </p>
        <PosterPrintBar />
        <PosterPromptPanel templateId={templateId} />
      </div>

      <PosterDesignedLayout
        templateId={templateId}
        headline={headline}
        details={posterBody}
        imageUrls={imageUrls}
        contact={contact}
        listingQrDataUrl={listingQrDataUrl}
        listingAgentName={listingAgentName}
        listingAgentCompany={listingAgentCompany}
        listingAgentPhone={listingAgentPhone}
        listingAgentPhotoUrl={listingAgentPhotoUrl}
        brandLogoUrl={mp?.logo_url?.trim() ?? null}
        wechatQrUrl={posterContact?.wechat_qr_url ?? null}
        whatsappUrl={posterContact?.whatsapp_url ?? null}
      />
    </div>
  );
}
