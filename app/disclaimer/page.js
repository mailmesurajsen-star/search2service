import { LegalPage, LegalSection } from '@/components/legal-page';

export const metadata = { title: 'Disclaimer — Search2Service' };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updatedDate="August 24, 2026">
      <LegalSection title="1. General Information Only">
        <p>
          The content on Search2Service — including provider listings, ratings, job postings, government service
          information, and blog articles — is provided for general informational purposes only. We make reasonable
          efforts to keep information accurate, but we do not warrant its completeness, accuracy, or timeliness.
        </p>
      </LegalSection>

      <LegalSection title="2. Third-Party Listings">
        <p>
          Providers, businesses, and job listings on Search2Service are created and managed by independent third
          parties. Search2Service does not independently verify every claim made in a listing and is not responsible
          for the accuracy of pricing, qualifications, availability, or outcomes of services booked through the
          Platform.
        </p>
      </LegalSection>

      <LegalSection title="3. Not Medical, Legal, or Financial Advice">
        <p>
          Information related to healthcare providers, government services, insurance, or financial/legal
          consultants listed on the Platform does not constitute medical, legal, or financial advice. Always consult
          a qualified, licensed professional directly for such matters. In a medical emergency, call 108 (Ambulance)
          or visit your nearest hospital immediately.
        </p>
      </LegalSection>

      <LegalSection title="4. Government Services Disclaimer">
        <p>
          Listings under "Government Services" (such as CSC Centers or document assistance agents) are independent
          facilitation services and are not operated by, affiliated with, or endorsed by any government department.
          Always verify official processes on the relevant government website.
        </p>
      </LegalSection>

      <LegalSection title="5. External Links">
        <p>
          Our Platform may contain links to third-party websites. We are not responsible for the content, privacy
          practices, or accuracy of any linked external site.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitation of Liability">
        <p>
          Use of the Platform and any service booked through it is at your own discretion and risk. Search2Service
          shall not be held liable for any loss, damage, or dispute arising from your interaction with a Provider,
          Customer, or third party found through the Platform.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact Us">
        <p>
          If you believe any content on Search2Service is inaccurate or misleading, please let us know via our{' '}
          <a href="/contact" className="text-primary font-semibold hover:underline">Contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
