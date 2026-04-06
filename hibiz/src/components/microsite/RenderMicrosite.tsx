import type { FormFieldsFileV1 } from "@/lib/generation/form-presets";
import { contactLinesFromMerchant, safeExternalImageUrl } from "@/lib/merchant-profile/render-merge";
import type { MerchantProfileV1 } from "@/types/merchant-profile";
import type { RenderModelV1 } from "@/types/render-model";
import { EditableInlineText } from "./EditableInlineText";
import {
  ListingsModuleSection,
  OpenHomeModuleSection,
  ServicesModuleSection,
  TestimonialsModuleSection,
} from "./microsite-skeleton-sections";
import { LeadFormBlock } from "./LeadFormBlock";

interface RenderMicrositeProps {
  model: RenderModelV1;
  formFields?: FormFieldsFileV1 | null;
  preview?: boolean;
  /** When set, the lead form submits to Supabase (public live site only). */
  interactiveForm?: { formId: string; projectId: string } | null;
  /** Merchant-configured contact + property image (microsites.merchant_profile). */
  merchantProfile?: MerchantProfileV1 | null;
  /** 骨架预览：启用 hero 标题等 contentEditable 微调 */
  editableProjectId?: string | null;
}

export function RenderMicrosite({
  model,
  formFields,
  preview,
  interactiveForm,
  merchantProfile,
  editableProjectId,
}: RenderMicrositeProps) {
  const { theme } = model;
  const isTeal = theme.preset === "trust_teal";
  const hex = theme.skeleton_hex;
  const bgMain = hex ? "" : isTeal ? "bg-emerald-950" : "bg-stone-900";
  const headerBgStyle = hex ? { backgroundColor: hex.primary } : undefined;
  const accentText = hex ? "text-white/80" : isTeal ? "text-emerald-300" : "text-amber-200";
  const bulletAccent = hex?.accent ?? (isTeal ? "#10b981" : "#d97706");
  const heroImageUrl =
    safeExternalImageUrl(merchantProfile?.property_promo?.image_url) ??
    safeExternalImageUrl(merchantProfile?.avatar_url) ??
    safeExternalImageUrl(merchantProfile?.logo_url);

  const pageBg = hex?.background;

  return (
    <article
      className={`min-h-screen text-stone-900 ${pageBg ? "" : "bg-stone-50"}`}
      style={pageBg ? { backgroundColor: pageBg } : undefined}
    >
      {preview ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          Preview — not the public live URL yet
        </div>
      ) : null}

      {model.modules.map((mod) => {
        if (mod.type === "hero") {
          const { content } = mod;
          return (
            <header
              key={mod.id}
              className={`${bgMain} px-4 py-16 text-white`}
              style={headerBgStyle}
            >
              <div className="mx-auto max-w-3xl text-center">
                {merchantProfile?.logo_url?.trim() ? (
                  <div className="mb-6 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={merchantProfile.logo_url.trim()}
                      alt=""
                      className="h-14 w-auto max-w-[200px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}
                {heroImageUrl ? (
                  <div className="mx-auto mb-8 max-w-2xl overflow-hidden rounded-xl border border-white/10 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export; external URLs */}
                    <img src={heroImageUrl} alt="" className="max-h-[22rem] w-full object-cover" />
                  </div>
                ) : null}
                {content.eyebrow ? (
                  <p className={`text-sm font-semibold uppercase tracking-widest ${accentText}`}>{content.eyebrow}</p>
                ) : null}
                {editableProjectId && preview ? (
                  <EditableInlineText
                    projectId={editableProjectId}
                    moduleId={mod.id}
                    field="title"
                    initialText={content.title}
                    as="h1"
                    className="mt-4 block font-display text-3xl font-semibold leading-tight outline-none ring-emerald-400/50 focus:ring-2 sm:text-4xl"
                  />
                ) : (
                  <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{content.title}</h1>
                )}
                {editableProjectId && preview ? (
                  <EditableInlineText
                    projectId={editableProjectId}
                    moduleId={mod.id}
                    field="subtitle"
                    initialText={content.subtitle}
                    as="p"
                    className="mt-4 block text-lg text-stone-200 outline-none ring-emerald-400/50 focus:ring-2"
                  />
                ) : (
                  <p className="mt-4 text-lg text-stone-200">{content.subtitle}</p>
                )}
                {content.subtitle_secondary ? (
                  <p className="mt-2 text-base text-stone-300">{content.subtitle_secondary}</p>
                ) : null}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <span
                    className={`rounded-full px-6 py-3 text-sm font-semibold text-white ${!hex?.accent ? (isTeal ? "bg-emerald-500" : "bg-amber-500") : ""}`}
                    style={hex?.accent ? { backgroundColor: hex.accent } : undefined}
                  >
                    {content.primary_cta_label}
                  </span>
                  {content.secondary_cta_label ? (
                    <span className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white">
                      {content.secondary_cta_label}
                    </span>
                  ) : null}
                </div>
              </div>
            </header>
          );
        }

        if (mod.type === "offer") {
          const { content } = mod;
          return (
            <section key={mod.id} className="px-4 py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-2xl font-semibold text-stone-900">{content.heading}</h2>
                <ul className={`mt-6 space-y-3 text-stone-700`}>
                  {content.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span style={{ color: bulletAccent }}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {content.footnote ? <p className="mt-6 text-sm text-stone-500">{content.footnote}</p> : null}
              </div>
            </section>
          );
        }

        if (mod.type === "form") {
          const { content } = mod;
          const fields = formFields?.fields ?? [];
          const canSubmit =
            interactiveForm != null && fields.length > 0 && interactiveForm.formId === content.form_ref.form_id;

          return (
            <section key={mod.id} id="form" className={`border-y border-stone-200 px-4 py-12 ${isTeal ? "bg-emerald-50/40" : "bg-amber-50/40"}`}>
              <div className="mx-auto max-w-xl">
                <h2 className="font-display text-2xl font-semibold text-stone-900">{content.heading}</h2>
                {content.description ? <p className="mt-2 text-sm text-stone-600">{content.description}</p> : null}
                <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  {canSubmit ? (
                    <LeadFormBlock
                      formId={interactiveForm.formId}
                      projectId={interactiveForm.projectId}
                      fields={fields}
                      submitLabel={content.submit_label}
                      privacyNote={content.privacy_note}
                      isTeal={isTeal}
                    />
                  ) : (
                    <div className="space-y-4">
                      {fields.map((f) => (
                        <div key={f.key}>
                          <label className="block text-sm font-medium text-stone-700">{f.label}</label>
                          {f.type === "textarea" ? (
                            <textarea
                              readOnly
                              className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
                              rows={3}
                              placeholder={f.placeholder}
                            />
                          ) : f.type === "select" ? (
                            <select disabled className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                              <option value="">{f.placeholder || "Select"}</option>
                              {(f.options ?? []).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              readOnly
                              className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
                              placeholder={f.placeholder}
                              type={f.type === "email" ? "email" : "text"}
                            />
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className={`w-full rounded-lg py-3 text-sm font-semibold text-white ${isTeal ? "bg-emerald-800" : "bg-amber-800"}`}
                      >
                        {content.submit_label}
                      </button>
                      <p id="privacy-note" className="text-xs text-stone-500">
                        {content.privacy_note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (mod.type === "faq") {
          const { content } = mod;
          return (
            <section key={mod.id} className="px-4 py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-2xl font-semibold text-stone-900">{content.heading}</h2>
                <dl className="mt-6 space-y-6">
                  {content.items.map((item) => (
                    <div key={item.q}>
                      <dt className="font-medium text-stone-900">{item.q}</dt>
                      <dd className="mt-2 text-sm text-stone-600">{item.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          );
        }

        if (mod.type === "about") {
          const { content } = mod;
          return (
            <section key={mod.id} className="px-4 py-12">
              <div className="mx-auto max-w-3xl">
                {content.badge ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{content.badge}</p>
                ) : null}
                <h2 className="mt-2 font-display text-2xl font-semibold text-stone-900">{content.heading}</h2>
                <p className="mt-4 whitespace-pre-wrap text-stone-700">{content.body}</p>
              </div>
            </section>
          );
        }

        if (mod.type === "contact") {
          const { content } = mod;
          const lines = contactLinesFromMerchant(content.lines, merchantProfile?.contact);
          const wxUrl = merchantProfile?.contact?.wechat_qr_url?.trim();
          return (
            <section key={mod.id} className="px-4 py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-2xl font-semibold text-stone-900">{content.heading}</h2>
                <ul className="mt-4 space-y-2 text-stone-700">
                  {lines.map((line) => (
                    <li key={line}>
                      {line.startsWith("WhatsApp: https://") ? (
                        <a href={line.replace("WhatsApp: ", "")} className="text-emerald-800 underline">
                          WhatsApp
                        </a>
                      ) : (
                        line
                      )}
                    </li>
                  ))}
                </ul>
                {wxUrl ? (
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-sm text-stone-600">微信</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={wxUrl} alt="" className="h-36 w-36 rounded-lg border border-stone-200 object-contain" />
                  </div>
                ) : null}
                {content.hours ? <p className="mt-4 text-sm text-stone-500">{content.hours}</p> : null}
              </div>
            </section>
          );
        }

        if (mod.type === "listings") {
          return <ListingsModuleSection key={mod.id} content={mod.content} />;
        }

        if (mod.type === "testimonials") {
          return <TestimonialsModuleSection key={mod.id} content={mod.content} />;
        }

        if (mod.type === "openHome") {
          return <OpenHomeModuleSection key={mod.id} content={mod.content} />;
        }

        if (mod.type === "services") {
          return <ServicesModuleSection key={mod.id} content={mod.content} />;
        }

        if (mod.type === "footer") {
          const { content } = mod;
          return (
            <footer key={mod.id} className="border-t border-stone-200 bg-stone-100 px-4 py-10">
              <div className="mx-auto max-w-3xl text-center text-sm text-stone-600">
                <p className="font-display font-semibold text-stone-800">{content.brand}</p>
                <p className="mt-4 text-left text-xs leading-relaxed text-stone-500">{content.disclaimer}</p>
              </div>
            </footer>
          );
        }

        return null;
      })}
    </article>
  );
}
