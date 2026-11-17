import { Header } from "@/components/Header";
import { Section, Tag } from "@/components/Section";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  publications,
  skillGroups,
  stats,
} from "@/data/profile";

const linkClass =
  "rounded-full border border-line bg-card px-6 py-3 text-sm font-medium transition hover:border-accent hover:text-accent";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="py-20 sm:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Open to freelance and remote roles
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">
            Hi, I am <span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="mt-5 text-xl font-medium sm:text-2xl">{profile.title}</p>
          <p className="mt-1 text-muted">{profile.location}</p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{profile.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-85"
            >
              Get in touch
            </a>
            <a href="#projects" className={linkClass}>
              View projects
            </a>
            <a href={profile.links.github} className={linkClass} rel="noreferrer">
              GitHub
            </a>
            <a href={profile.links.linkedin} className={linkClass} rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-card p-5">
                <dt className="gradient-text text-3xl font-semibold tracking-tight">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Section id="about" eyebrow="About" title="Building things that stay up">
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-muted">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow="Skills" title="What I work with">
          <div className="grid gap-6 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.name} className="card rounded-2xl border border-line bg-card p-6">
                <h3 className="font-semibold">{g.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" eyebrow="Experience" title="Where I have worked">
          <ol className="space-y-10">
            {experience.map((job) => (
              <li
                key={job.company}
                className="grid gap-4 border-l-2 border-accent/40 pl-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <div>
                  <p className="text-sm text-muted">{job.period}</p>
                  <p className="mt-1 font-semibold">{job.company}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <p className="mt-2 text-muted">{job.summary}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-accent">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" eyebrow="Projects" title="Selected work">
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <article
                key={p.name}
                className="flex flex-col card rounded-2xl border border-line bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-3 flex-1 leading-7 text-muted">{p.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t}>
                      <Tag>{t}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="certifications"
          eyebrow="Certifications"
          title="Credentials and education"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {certifications.map((c) => (
              <a
                key={c.name}
                href={c.url}
                rel="noreferrer"
                className="card rounded-2xl border border-line bg-card p-6"
              >
                <p className="text-sm text-muted">{c.issuer}</p>
                <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
                <p className="mt-3 text-sm text-muted">Issued {c.issued}</p>
                <p className="mt-4 text-sm font-medium text-accent">View certificate</p>
              </a>
            ))}
            <div className="card rounded-2xl border border-line bg-card p-6">
              <p className="text-sm text-muted">{education.period}</p>
              <h3 className="mt-1 text-lg font-semibold">{education.degree}</h3>
              <p className="mt-3 text-muted">{education.school}</p>
            </div>
          </div>
        </Section>

        <Section id="publications" eyebrow="Writing" title="Publications">
          <div className="grid gap-6">
            {publications.map((p) => (
              <a
                key={p.doi}
                href={p.url}
                rel="noreferrer"
                className="card rounded-2xl border border-line bg-card p-6"
              >
                <p className="text-sm text-muted">
                  {p.venue} · {p.date}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-muted">{p.summary}</p>
                <p className="mt-4 text-sm font-medium text-accent">DOI: {p.doi}</p>
              </a>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Let's work together">
          <p className="max-w-2xl text-lg leading-8 text-muted">
            I take on SaaS builds, codebase takeovers, cloud migrations and AI features.
            Send a short note on where things stand and what you need next, and I will
            reply with how I would approach it.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a href={`mailto:${profile.email}`} className="card rounded-2xl border border-line bg-card p-6">
              <p className="text-sm text-muted">Email</p>
              <p className="mt-1 break-all font-semibold">{profile.email}</p>
            </a>
            <a href={`tel:${profile.phoneE164}`} className="card rounded-2xl border border-line bg-card p-6">
              <p className="text-sm text-muted">Phone</p>
              <p className="mt-1 font-semibold">{profile.phone}</p>
            </a>
            <a href={profile.whatsapp} rel="noreferrer" className="card rounded-2xl border border-line bg-card p-6">
              <p className="text-sm text-muted">WhatsApp</p>
              <p className="mt-1 font-semibold">{profile.phone}</p>
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={profile.links.linkedin} className={linkClass} rel="noreferrer">
              Message on LinkedIn
            </a>
            <a href={profile.links.upwork} className={linkClass} rel="noreferrer">
              Hire on Upwork
            </a>
            <a href={profile.links.fiverr} className={linkClass} rel="noreferrer">
              Fiverr
            </a>
            <a href={profile.links.github} className={linkClass} rel="noreferrer">
              GitHub
            </a>
          </div>
        </Section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
          {profile.name}. Built with Next.js and deployed on Vercel.
        </div>
      </footer>
    </>
  );
}
