import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMineEntries } from '@/data/buildMineEntries';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Magic Engine Build Mine | Magic Lab',
  description:
    'A public build log that turns Magic Lab daily AI-assisted product work into visible proof of work, artifacts, and technical progress.',
  path: '/magic-engine/build-mine',
  keywords: [
    'AI build log',
    'AI automation proof of work',
    'Magic Engine build notes',
    'AI product development log',
  ],
});

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getYearDays(year: number) {
  const days: string[] = [];
  const date = new Date(`${year}-01-01T00:00:00.000Z`);

  while (date.getUTCFullYear() === year) {
    days.push(toDateKey(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return days;
}

function getStreak(dates: Set<string>, latestDate: string) {
  if (!latestDate) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(`${latestDate}T00:00:00.000Z`);

  while (dates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function intensityClass(intensity: number) {
  if (intensity >= 90) {
    return 'bg-aqua shadow-[0_0_20px_rgba(200,242,255,0.55)]';
  }
  if (intensity >= 70) {
    return 'bg-[#8fd7ff]';
  }
  if (intensity >= 45) {
    return 'bg-[#2a5b7f]';
  }
  if (intensity > 0) {
    return 'bg-white/25';
  }
  return 'bg-white/[0.055]';
}

export default function BuildMinePage() {
  const entries = buildMineEntries;
  const entryByDate = new Map(entries.map((entry) => [entry.date, entry]));
  const latest = entries[0];
  const latestYear = latest ? Number(latest.date.slice(0, 4)) : new Date().getFullYear();
  const yearDays = getYearDays(latestYear);
  const minedDates = new Set(entries.map((entry) => entry.date));
  const totalArtifacts = entries.reduce((sum, entry) => sum + entry.artifacts, 0);
  const totalCommits = entries.reduce((sum, entry) => sum + entry.commits, 0);
  const averageIntensity = entries.length
    ? Math.round(entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length)
    : 0;
  const currentStreak = latest ? getStreak(minedDates, latest.date) : 0;

  return (
    <div className="bg-gray-950 text-white">
      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid min-h-[620px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="section-kicker">Magic Engine Build Mine</p>
              <h1 className="hero-title mt-5 text-5xl md:text-7xl leading-[0.95] text-white">
                Proof of work, mined from daily AI-assisted building.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-silver/85">
                Every public-ready Claude Code and Codex daily log becomes a visible build artifact:
                product progress, technical decisions, shipped systems, and hard-earned learning.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/magic-engine" className="btn-primary rounded-full px-8 py-4 text-center font-bold">
                  See Magic Engine
                </Link>
                <Link href="/work" className="btn-secondary rounded-full px-8 py-4 text-center font-bold">
                  View Case Studies
                </Link>
              </div>
            </div>

            <div className="app-window rounded-[32px] p-6 md:p-8">
              <div className="relative z-10">
                <p className="section-kicker">Current Mine State</p>
                <div className="mt-7 grid grid-cols-2 gap-4">
                  {[
                    ['Build days', entries.length],
                    ['Current streak', currentStreak],
                    ['Artifacts', totalArtifacts],
                    ['Commits logged', totalCommits],
                  ].map(([label, value]) => (
                    <div key={label} className="screen-card rounded-2xl p-5">
                      <p className="text-3xl font-black text-white">{value}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-mist">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-3xl border border-aqua/20 bg-aqua/[0.08] p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-aqua">Average intensity</p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-aqua" style={{ width: `${averageIntensity}%` }} />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{averageIntensity} XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">{latestYear} Mining Map</p>
            <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
              A year of building, one square at a time.
            </h2>
          </div>
          <div className="app-window rounded-[28px] p-5 md:p-7">
            <div
              className="relative z-10 grid gap-1"
              style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' } as CSSProperties}
            >
              {yearDays.map((day) => {
                const entry = entryByDate.get(day);
                return (
                  <span
                    key={day}
                    title={entry ? `${day}: ${entry.title}` : day}
                    className={`aspect-square rounded-[3px] ${intensityClass(entry?.intensity || 0)}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="photo-section py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">Latest Artifacts</p>
            <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
              What came out of the mine.
            </h2>
          </div>
          <div className="grid gap-6">
            {entries.map((entry) => (
              <article key={`${entry.date}-${entry.project}`} className="app-window rounded-[28px] p-6 md:p-8">
                <div className="relative z-10 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-aqua">{entry.date}</p>
                    <h3 className="mt-4 text-2xl md:text-3xl font-extrabold text-white">{entry.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-mist">{entry.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-silver">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        ['Commits', entry.commits],
                        ['Artifacts', entry.artifacts],
                        ['XP', entry.intensity],
                      ].map(([label, value]) => (
                        <div key={label} className="screen-card rounded-2xl p-4">
                          <p className="text-2xl font-black text-white">{value}</p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-mist">{label}</p>
                        </div>
                      ))}
                    </div>
                    {entry.gems.length ? (
                      <div className="grid gap-3">
                        {entry.gems.map((gem) => (
                          <div key={gem.title} className="screen-card rounded-2xl p-4">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">{gem.type}</p>
                            <p className="mt-2 text-base font-bold leading-7 text-white">{gem.title}</p>
                            {gem.platform ? <p className="mt-2 text-xs font-semibold text-mist">{gem.platform}</p> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="screen-card rounded-2xl p-4 text-sm leading-7 text-mist">{entry.publicNote}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
