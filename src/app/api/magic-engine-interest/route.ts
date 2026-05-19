import { NextResponse } from 'next/server';

type InterestPayload = {
  language?: 'zh' | 'en';
  name?: string;
  email?: string;
  company?: string;
  interest?: string;
  message?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const field = (label: string, value?: string) =>
  `<p><strong>${label}:</strong> ${escapeHtml(value?.trim() || 'Not provided')}</p>`;

export async function POST(request: Request) {
  let payload: InterestPayload;

  try {
    payload = (await request.json()) as InterestPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const interest = payload.interest?.trim();

  if (!name || !email || !interest || !emailPattern.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Name, valid email, and interest are required.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Magic Lab <onboarding@resend.dev>';
  const to = process.env.MAGIC_ENGINE_TO || 'bigbigraydeng@gmail.com';

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  const language = payload.language === 'en' ? 'English' : 'Chinese';
  const company = payload.company?.trim();
  const message = payload.message?.trim();
  const submittedAt = new Date().toISOString();
  const subject = `Magic Engine interest: ${name} (${interest})`;
  const text = [
    `Magic Engine interest submission`,
    `Language: ${language}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'Not provided'}`,
    `Interest: ${interest}`,
    `Message: ${message || 'Not provided'}`,
    `Submitted at: ${submittedAt}`,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0A1A2B;">
      <h2>Magic Engine interest submission</h2>
      ${field('Language', language)}
      ${field('Name', name)}
      ${field('Email', email)}
      ${field('Company', company)}
      ${field('Interest', interest)}
      ${field('Message', message)}
      ${field('Submitted at', submittedAt)}
    </div>
  `;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject,
      html,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    console.error('Resend email failed', detail);
    return NextResponse.json({ ok: false, error: 'Email delivery failed.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
