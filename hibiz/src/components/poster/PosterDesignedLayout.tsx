import type { PosterTemplateId } from "@/data/poster-templates";
import type { MerchantContactV1 } from "@/types/merchant-profile";

export interface PosterDesignedLayoutProps {
  templateId: PosterTemplateId;
  headline: string;
  /** 海报正文：中英摘要或 Property details 回退 */
  details: string;
  imageUrls: string[];
  contact: MerchantContactV1 | undefined;
  /** 扫码打开 Trade Me（不在版面上印明文 URL） */
  listingQrDataUrl: string | null;
  listingAgentName?: string | null;
  listingAgentCompany?: string | null;
  /** 优先 listing 导入；否则回退到 Contact 电话 */
  listingAgentPhone?: string | null;
  listingAgentPhotoUrl?: string | null;
}

function QrBlock({
  dataUrl,
  captionZh,
  captionEn,
}: {
  dataUrl: string;
  captionZh: string;
  captionEn: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt=""
        width={200}
        height={200}
        className="h-44 w-44 rounded-xl bg-white p-2 shadow-lg"
      />
      <p className="mt-2 text-[11px] leading-snug opacity-90">
        <span className="block">{captionZh}</span>
        <span className="mt-0.5 block font-mono text-[10px] opacity-80">{captionEn}</span>
      </p>
    </div>
  );
}

function ListingAgentCard({
  name,
  company,
  phone,
  photoUrl,
  variant,
}: {
  name: string | null | undefined;
  company: string | null | undefined;
  phone: string | null | undefined;
  photoUrl: string | null | undefined;
  variant: "coastal" | "light" | "minimal";
}) {
  if (!name?.trim() && !company?.trim() && !photoUrl?.trim() && !phone?.trim()) {
    return null;
  }

  const textMuted =
    variant === "coastal"
      ? "text-emerald-100/90"
      : variant === "minimal"
        ? "text-stone-500"
        : "text-stone-600";
  const nameClass =
    variant === "coastal" ? "text-white font-semibold" : "font-semibold text-stone-900";
  const ring = variant === "coastal" ? "ring-2 ring-white/30" : "ring-2 ring-stone-200";
  const phoneClass =
    variant === "coastal" ? "text-teal-100/95" : variant === "minimal" ? "text-stone-600" : "text-stone-700";

  return (
    <div
      className={`flex items-center justify-center gap-4 ${
        variant === "coastal" ? "rounded-2xl bg-black/20 px-5 py-4 backdrop-blur-md" : "rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3"
      }`}
    >
      {photoUrl?.trim() ? (
        <div className={`h-16 w-16 shrink-0 overflow-hidden rounded-full ${ring}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl.trim()} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      ) : (
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
            variant === "coastal" ? "bg-white/15 text-white/90" : "bg-stone-200 text-stone-600"
          }`}
        >
          {(name?.trim() ?? company?.trim() ?? phone?.trim() ?? "?").slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 text-left">
        {name?.trim() ? <p className={`text-lg leading-tight ${nameClass}`}>{name.trim()}</p> : null}
        {company?.trim() ? <p className={`mt-0.5 text-sm ${textMuted}`}>{company.trim()}</p> : null}
        {phone?.trim() ? <p className={`mt-1.5 text-sm font-medium ${phoneClass}`}>{phone.trim()}</p> : null}
        {!name?.trim() && !company?.trim() && !phone?.trim() ? <p className={`text-sm ${textMuted}`}>Listing agent</p> : null}
      </div>
    </div>
  );
}

function ContactBlock({ contact }: { contact: MerchantContactV1 | undefined }) {
  return (
    <div className="mt-auto border-t border-white/15 pt-6 text-center text-sm text-white/90">
      {contact?.email ? <p>Email: {contact.email}</p> : null}
      {contact?.address ? <p className="mt-2 whitespace-pre-line text-white/80">{contact.address}</p> : null}
      {!contact?.email && !contact?.address ? (
        <p className="text-white/45">商家联系可在项目页「Business details」补充邮箱与地址</p>
      ) : null}
    </div>
  );
}

function ImageGrid({ urls, rounded }: { urls: string[]; rounded: string }) {
  if (urls.length === 0) {
    return (
      <div
        className={`flex h-52 items-center justify-center border border-dashed border-white/30 bg-white/5 text-sm text-white/50 ${rounded}`}
      >
        添加图片 URL 或从链接导入房源
      </div>
    );
  }
  if (urls.length === 1) {
    return (
      <div className={`overflow-hidden ${rounded}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urls[0]}
          alt=""
          className="max-h-80 w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }
  const gridClass =
    urls.length <= 2
      ? "grid grid-cols-2 gap-2"
      : urls.length <= 4
        ? "grid grid-cols-2 gap-2"
        : "grid grid-cols-3 gap-1.5 sm:grid-cols-4";
  return (
    <div className={`${gridClass} ${rounded} overflow-hidden`}>
      {urls.map((src) => (
        <div key={src} className="aspect-[4/3] overflow-hidden bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      ))}
    </div>
  );
}

export function PosterDesignedLayout({
  templateId,
  headline,
  details,
  imageUrls,
  contact,
  listingQrDataUrl,
  listingAgentName,
  listingAgentCompany,
  listingAgentPhone,
  listingAgentPhotoUrl,
}: PosterDesignedLayoutProps) {
  const qrCaptionZh = "扫码查看 Trade Me 完整房源";
  const qrCaptionEn = "Scan for full listing";

  if (templateId === "grid_gallery") {
    return (
      <div
        className="poster-sheet mx-auto flex max-w-[210mm] flex-col bg-[#faf9f7] p-8 shadow-lg print:border-0 print:shadow-none"
        style={{ minHeight: "297mm" }}
      >
        <div className="text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-400">HiBiz · gallery</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-stone-900">{headline}</h2>
        </div>
        <div className="mt-5">
          <ListingAgentCard
            name={listingAgentName}
            company={listingAgentCompany}
            phone={listingAgentPhone}
            photoUrl={listingAgentPhotoUrl}
            variant="light"
          />
        </div>
        <div className="mt-6">
          <ImageGrid urls={imageUrls} rounded="rounded-2xl" />
        </div>
        {details ? (
          <p className="mt-8 whitespace-pre-wrap text-center text-sm leading-relaxed text-stone-600">{details}</p>
        ) : null}
        {listingQrDataUrl ? (
          <div className="mt-8 flex justify-center">
            <QrBlock dataUrl={listingQrDataUrl} captionZh={qrCaptionZh} captionEn={qrCaptionEn} />
          </div>
        ) : null}
        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-700">
          {contact?.phone ? <p>Phone: {contact.phone}</p> : null}
          {contact?.email ? <p className="mt-1">Email: {contact.email}</p> : null}
          {contact?.address ? <p className="mt-2 whitespace-pre-line text-stone-600">{contact.address}</p> : null}
        </div>
        <p className="mt-8 text-center font-mono text-[9px] text-stone-300">HiBiz · magiclab.com</p>
      </div>
    );
  }

  if (templateId === "minimal_luxury") {
    return (
      <div
        className="poster-sheet mx-auto max-w-[210mm] border-[3px] border-double border-stone-300 bg-white p-12 shadow-lg print:border-double print:shadow-none"
        style={{ minHeight: "297mm" }}
      >
        <div className="flex min-h-[240mm] flex-col">
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.5em] text-stone-400">Property</p>
          <h2 className="mt-8 text-center font-display text-4xl font-light tracking-tight text-stone-900">{headline}</h2>
          <div className="mx-auto mt-6 max-w-md">
            <ListingAgentCard
              name={listingAgentName}
              company={listingAgentCompany}
              phone={listingAgentPhone}
              photoUrl={listingAgentPhotoUrl}
              variant="minimal"
            />
          </div>
          <div className="mx-auto mt-6 w-24 border-t border-stone-300" />
          <div className="mt-10 max-h-64 overflow-hidden rounded-sm border border-stone-200">
            {imageUrls[0] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrls[0]}
                alt=""
                className="h-64 w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-stone-50 text-sm text-stone-400">Image</div>
            )}
          </div>
          {details ? (
            <p className="mt-10 whitespace-pre-wrap text-center text-sm font-light leading-loose text-stone-600">{details}</p>
          ) : null}
          {listingQrDataUrl ? (
            <div className="mt-8 flex justify-center">
              <QrBlock dataUrl={listingQrDataUrl} captionZh={qrCaptionZh} captionEn={qrCaptionEn} />
            </div>
          ) : null}
          <div className="mt-auto border-t border-stone-200 pt-8 text-center text-xs font-light text-stone-500">
            {contact?.phone ? <p>{contact.phone}</p> : null}
            {contact?.email ? <p className="mt-1">{contact.email}</p> : null}
            {contact?.address ? <p className="mt-2 whitespace-pre-line">{contact.address}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="poster-sheet mx-auto max-w-[210mm] overflow-hidden rounded-sm shadow-2xl print:shadow-none"
      style={{ minHeight: "297mm" }}
    >
      <div
        className="relative px-8 pb-12 pt-14 text-white"
        style={{
          background: "linear-gradient(168deg, #022c26 0%, #115e59 38%, #0d9488 72%, #134e4a 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <p className="relative text-center font-mono text-[10px] uppercase tracking-[0.45em] text-teal-200/85">
          New Zealand property
        </p>
        <h2 className="relative mt-5 text-center font-display text-[2.1rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.45rem]">
          {headline}
        </h2>

        <div className="relative mx-auto mt-8 max-w-lg">
          <ListingAgentCard
            name={listingAgentName}
            company={listingAgentCompany}
            phone={listingAgentPhone}
            photoUrl={listingAgentPhotoUrl}
            variant="coastal"
          />
        </div>

        <div className="relative mt-10">
          <ImageGrid urls={imageUrls} rounded="rounded-xl" />
        </div>

        {details ? (
          <div className="relative mx-auto mt-10 max-w-xl rounded-2xl bg-black/15 px-6 py-5 text-left backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-200/80">Highlights</p>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.65] text-teal-50">{details}</p>
          </div>
        ) : null}

        {listingQrDataUrl ? (
          <div className="relative mt-10 flex justify-center">
            <QrBlock dataUrl={listingQrDataUrl} captionZh={qrCaptionZh} captionEn={qrCaptionEn} />
          </div>
        ) : null}

        <ContactBlock contact={contact} />
        <p className="relative mt-8 text-center font-mono text-[9px] text-teal-300/45">HiBiz · magiclab.com</p>
      </div>
    </div>
  );
}
