import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  MapPin,
  Scale,
  Eye,
  Lock,
  FileText,
} from "lucide-react";

export function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Maps2Chat";
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans relative overflow-hidden pb-16">
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 right-0 size-125 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-125 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-linear-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              M
            </div>
            <span className="font-bold text-lg tracking-tight">Maps2Chat</span>
          </div>
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-emerald-500/10 hover:text-emerald-500"
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
        <div className="flex flex-col gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 self-start border border-emerald-500/20">
            <Shield className="size-3" />
            Privacy Assurance
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: July 9, 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Nav Panel */}
          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-24 flex flex-col gap-1 text-sm border-l border-border pl-4">
              <a
                href="#introduction"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                1. Introduction
              </a>
              <a
                href="#collect"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                2. Data We Collect
              </a>
              <a
                href="#how-use"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                3. How We Use Data
              </a>
              <a
                href="#lead-data"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                4. B2B Lead Security
              </a>
              <a
                href="#retention"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                5. Data Retention
              </a>
              <a
                href="#your-rights"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                6. Operator Rights
              </a>
              <a
                href="#compliance"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                7. Compliance
              </a>
            </div>
          </aside>

          {/* Policy Text */}
          <div className="md:col-span-3 prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section id="introduction" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <FileText className="size-5 text-emerald-500" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maps2Chat ("we", "us", or "our") operates a specialized B2B CRM
                application. We are committed to protecting the privacy of our
                operators (users of the CRM) as well as ensuring that the B2B
                contact data ingested and managed by the system is processed
                lawfully, transparently, and in alignment with regional data
                privacy frameworks.
              </p>
            </section>

            <section id="collect" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Eye className="size-5 text-emerald-500" />
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We collect two types of information within Maps2Chat:
              </p>
              <div className="border border-border rounded-xl p-4 bg-card space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground">
                    A. Operator Account Information
                  </h4>
                  <p className="text-muted-foreground">
                    When you authenticate via <strong>Google OAuth 2.0</strong>,
                    we receive your email address, full name, and profile
                    picture. We do not solicit or store local passwords.
                  </p>
                </div>
                <hr className="border-border" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    B. Ingested B2B Lead Listings
                  </h4>
                  <p className="text-muted-foreground">
                    Our backend scraper aggregates public business listing
                    information from the Google Places API ecosystem. This data
                    is restricted to physical location details, business name,
                    physical address, and public B2B contact numbers.
                  </p>
                </div>
              </div>
            </section>

            <section id="how-use" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Lock className="size-5 text-emerald-500" />
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your profile information is used exclusively to control
                dashboard sessions, maintain user logs, and personalize the
                operator interface. Ingested business lead information is used
                to present your lead queues, record contacted history, and
                pre-fill client-side WhatsApp outreach links.
              </p>
            </section>

            <section id="lead-data" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <MapPin className="size-5 text-emerald-500" />
                4. B2B Lead Security & Regional Geofencing
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maps2Chat applies strict geographic filters to ensure data
                relevancy and privacy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-2">
                <li>
                  Every search is geofenced to the Kenya boundary coordinates
                  (-4.71 to 4.63 lat, 33.84 to 41.92 lng).
                </li>
                <li>
                  Leads are parsed and only saved if their physical address
                  contains "Kenya".
                </li>
                <li>
                  Phone numbers are normalized to E.164 standard, ensuring
                  contact logic is precise and targeted.
                </li>
                <li>
                  All messaging actions are executed directly by the user
                  (Human-in-the-loop). No server-side automatic messaging is
                  performed.
                </li>
              </ul>
            </section>

            <section id="retention" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Shield className="size-5 text-emerald-500" />
                5. Data Retention
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We store lead metrics and user profile logs in our secure cloud
                PostgreSQL database. Business leads marked as{" "}
                <strong>Archived</strong> are retained in the database to
                prevent re-scraping the same listings, but are excluded from
                active dashboard queues. Users may request full deletion of
                their account profile and CRM logs by contacting administration.
              </p>
            </section>

            <section id="your-rights" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Scale className="size-5 text-emerald-500" />
                6. Operator Rights & Control
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                As an operator, you have the right to request a copy of your
                session logs, update your Google profile link state, and
                disconnect your Google account from our services at any time.
              </p>
            </section>

            <section id="compliance" className="space-y-3 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Scale className="size-5 text-emerald-500" />
                7. Compliance & Regulatory Alignment
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Operators are responsible for ensuring that their B2B outreach
                communications comply with local laws and regulations, including
                the <strong>Kenya Data Protection Act (ODPC)</strong>. Maps2Chat
                acts strictly as a data processor for business listings sourced
                from public directories.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
