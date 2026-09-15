import { Link } from "wouter";

function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground font-sans">
      <header className="w-full px-8 md:px-16 py-8 border-b border-[#1a1a1a]">
        <Link href="/" className="font-serif font-bold text-xl text-[#F5F0E8] no-underline">
          IF.
        </Link>
      </header>

      <main className="px-8 md:px-16 py-16 md:py-24 max-w-3xl mx-auto">
        <h1 className="font-serif font-bold text-4xl md:text-6xl text-[#F5F0E8] uppercase leading-none mb-4">
          {title}
        </h1>
        <p className="font-sans font-light text-xs text-muted-foreground uppercase tracking-widest mb-16">
          Last updated {updated}
        </p>

        <div className="flex flex-col gap-10 font-sans font-light text-sm text-[#F5F0E8]/80 leading-relaxed [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-[#F5F0E8] [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mb-3 [&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_a]:text-[#FF4D00] [&_a]:hover:underline">
          {children}
        </div>

        <div className="mt-20 pt-10 border-t border-[#1a1a1a] flex gap-8 font-sans font-light text-xs text-muted-foreground uppercase tracking-wide">
          <Link href="/privacy" className="hover:text-[#F5F0E8] transition-colors no-underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#F5F0E8] transition-colors no-underline">Terms &amp; Conditions</Link>
          <Link href="/" className="hover:text-[#F5F0E8] transition-colors no-underline">Back Home</Link>
        </div>
      </main>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 19, 2026">
      <section>
        <h2>Overview</h2>
        <p>
          This site (isaacfigueroa.com) is operated by Isaac Figueroa as a personal portfolio. This
          policy explains what information is collected when you use the site and how it's used. By
          using this site, you agree to the collection and use of information as described here.
        </p>
      </section>

      <section>
        <h2>Information You Provide</h2>
        <p>
          If you submit the contact form or book a call, I collect the information you enter: name,
          email, phone number, project details, and any message content. This information is used
          solely to respond to your inquiry and discuss potential work. It is not sold or shared with
          third parties, other than the service providers below that process it on my behalf.
        </p>
      </section>

      <section>
        <h2>Automatically Collected Information</h2>
        <p>
          Like most websites, basic technical information (browser type, device type, pages visited,
          referring site, and approximate location derived from IP address) may be collected
          automatically through analytics and advertising tools, including Google Analytics/Ads and
          Meta Pixel, to understand how visitors use the site and to measure ad performance.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site may use cookies and similar technologies (such as the Meta Pixel) to remember
          preferences and measure traffic. You can disable cookies through your browser settings; the
          site will still function, though some analytics features may not.
        </p>
      </section>

      <section>
        <h2>Third Party Services</h2>
        <p>Data submitted or collected may pass through the following third party services:</p>
        <ul>
          <li>Web3Forms: processes contact form submissions</li>
          <li>Google Analytics / Meta Pixel: site and ad performance analytics</li>
          <li>Scheduling provider: processes call booking requests</li>
        </ul>
        <p>Each of these services has its own privacy policy governing how it handles your data.</p>
      </section>

      <section>
        <h2>Data Retention</h2>
        <p>
          Contact form and booking submissions are retained only as long as needed to respond to your
          inquiry and for basic business recordkeeping, after which they may be deleted.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of any personal information you've
          submitted by emailing{" "}
          <a href="mailto:isaacfigueroa561@gmail.com">isaacfigueroa561@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          This policy may be updated from time to time. Changes will be posted on this page with a
          revised "last updated" date.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach out at{" "}
          <a href="mailto:isaacfigueroa561@gmail.com">isaacfigueroa561@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsAndConditions() {
  return (
    <LegalLayout title="Terms &amp; Conditions" updated="August 19, 2026">
      <section>
        <h2>Agreement</h2>
        <p>
          These terms govern your use of isaacfigueroa.com, a personal portfolio site operated by
          Isaac Figueroa ("I," "me"). By browsing the site or submitting a form, you agree to these
          terms.
        </p>
      </section>

      <section>
        <h2>Site Content</h2>
        <p>
          All project work, case studies, images, and written content on this site are shown for
          portfolio purposes. Some projects are shown under agreement with past clients; case study
          details are shared to demonstrate process and results, not to disclose confidential client
          information.
        </p>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          Unless otherwise noted, all designs, branding, and written content on this site are my own
          work and may not be reproduced, redistributed, or used commercially without written
          permission. Client logos, brands, and marks shown belong to their respective owners.
        </p>
      </section>

      <section>
        <h2>Inquiries &amp; Project Work</h2>
        <p>
          Submitting the contact form or booking a call does not create a contract or working
          relationship. That happens only once a scope, timeline, and payment terms are agreed to
          separately, in writing, for a specific project.
        </p>
      </section>

      <section>
        <h2>No Warranty</h2>
        <p>
          This site and its content are provided "as is," without warranties of any kind. I make
          reasonable efforts to keep information accurate and the site available, but don't guarantee
          uninterrupted access or that all content is fully up to date.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          I'm not liable for any indirect, incidental, or consequential damages arising from your use
          of this site, to the fullest extent permitted by law.
        </p>
      </section>

      <section>
        <h2>External Links</h2>
        <p>
          This site links to third party sites (live client projects, social profiles, scheduling
          tools). I'm not responsible for the content or practices of those external sites.
        </p>
      </section>

      <section>
        <h2>Changes to These Terms</h2>
        <p>
          These terms may be updated periodically. Continued use of the site after changes are posted
          means you accept the revised terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Reach out at{" "}
          <a href="mailto:isaacfigueroa561@gmail.com">isaacfigueroa561@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
