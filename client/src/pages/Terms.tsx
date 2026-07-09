import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Cpu,
  Award,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | Maps2Chat";
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
            <BookOpen className="size-3" />
            Terms & Conditions
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Terms of Service
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
                href="#acceptance"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                1. Acceptance
              </a>
              <a
                href="#auth"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                2. Account & Auth
              </a>
              <a
                href="#acceptable-use"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                3. Acceptable Use
              </a>
              <a
                href="#scraper-limits"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                4. Scraper Quotas
              </a>
              <a
                href="#outreach"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                5. Outreach Control
              </a>
              <a
                href="#liability"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                6. Liability Limits
              </a>
              <a
                href="#governing"
                className="py-1.5 text-muted-foreground hover:text-emerald-500 transition-colors block font-medium"
              >
                7. Governing Law
              </a>
            </div>
          </aside>

          {/* Policy Text */}
          <div className="md:col-span-3 prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section id="acceptance" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <BookOpen className="size-5 text-emerald-500" />
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                By accessing or using Maps2Chat, you agree to comply with and be
                bound by these Terms of Service. If you do not agree to these
                terms, you may not access or use the system. These terms apply
                to all operators, developers, and administrators of the system.
              </p>
            </section>

            <section id="auth" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <UserCheck className="size-5 text-emerald-500" />
                2. Account Verification & OAuth
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Access to the Maps2Chat dashboard requires secure authentication
                via Google OAuth 2.0. You agree to provide accurate information
                through your Google profile. You are fully responsible for
                maintaining the confidentiality of your session token and all
                activities that occur under your authenticated session.
              </p>
            </section>

            <section id="acceptable-use" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShieldAlert className="size-5 text-emerald-500" />
                3. Acceptable Use Policy
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maps2Chat is built to streamline localized, professional
                business communication in Kenya. You agree not to:
              </p>
              <div className="border border-border rounded-xl p-4 bg-card text-sm space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    Use the platform to launch automated spamming tools, mass
                    robocalls, or programmatic messaging campaigns.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    Reverse-engineer the Maps2Chat API, bypass route
                    protections, or exploit the database.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    Scrape leads for resale or redistribute regional business
                    coordinates outside of your authorized organization.
                  </p>
                </div>
              </div>
            </section>

            <section id="scraper-limits" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Cpu className="size-5 text-emerald-500" />
                4. Scraper Daemon Quotas & Constraints
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The Google Places scraping daemon runs on a strict daily quota
                (exactly 10 new unique leads per day). Attempting to bypass,
                spoof, or force-run the daemon in a manner that exceeds Google
                Places API thresholds or compromises billing constraints is
                strictly prohibited and constitutes a violation of these terms.
              </p>
            </section>

            <section id="outreach" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <MessageSquare className="size-5 text-emerald-500" />
                5. Operator-Controlled Outreach (Human-in-the-Loop)
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Outreach messaging is operator-triggered via custom `wa.me`
                links. The platform does not directly connect to the WhatsApp
                Business API or send messages autonomously. The operator bears
                sole responsibility for complying with WhatsApp's Terms of
                Service and respecting recipients' preferences to opt out.
              </p>
            </section>

            <section id="liability" className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Award className="size-5 text-emerald-500" />
                6. Limitation of Liability & Warranty Disclaimer
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maps2Chat is provided "as is" and "as available". We do not
                guarantee that the Google Places data retrieved is error-free,
                complete, or up-to-date. We are not liable for any WhatsApp
                account suspensions, API billing overages, business disruptions,
                or regulatory actions resulting from your B2B outreach
                activities.
              </p>
            </section>

            <section id="governing" className="space-y-3 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <AlertCircle className="size-5 text-emerald-500" />
                7. Governing Law
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of Kenya, without regard to its
                conflict of law principles. Any dispute arising out of or
                related to these terms shall be subject to the exclusive
                jurisdiction of the courts of Kenya.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
