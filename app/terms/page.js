import { LegalPage, LegalSection } from '@/components/legal-page';

export const metadata = { title: 'Terms & Conditions — Search2Service' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updatedDate="August 24, 2026">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using Search2Service (the "Platform"), you agree to be bound by these Terms & Conditions.
          If you do not agree, please do not use the Platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Who Can Use Search2Service">
        <p>
          The Platform is available to Customers, Providers, Job Seekers, and Administrators. You must provide
          accurate information when registering and are responsible for maintaining the confidentiality of your
          account credentials.
        </p>
      </LegalSection>

      <LegalSection title="3. Search2Service is a Marketplace, Not a Service Provider">
        <p>
          Search2Service is a discovery and connection platform. We are not a party to any transaction, booking, or
          agreement between a Customer and a Provider. We do not employ, supervise, or guarantee the work of any
          listed Provider, and we are not responsible for the quality, legality, or outcome of any service booked
          through the Platform.
        </p>
      </LegalSection>

      <LegalSection title="4. Provider Listings & Responsibilities">
        <ul className="list-disc pl-5 space-y-1">
          <li>Providers must ensure all listing information — pricing, services, qualifications, and location — is accurate and up to date.</li>
          <li>Providers are solely responsible for the services they deliver and any licenses or certifications required by law.</li>
          <li>Search2Service reserves the right to verify, edit, suspend, or remove any listing that violates these Terms.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Premium Plan & Payments">
        <p>
          Providers may choose a paid Premium plan for priority placement and additional features. Payments are
          processed securely via our payment gateway partner. Plan pricing and features are shown on the Plan
          selection page and may change with notice. See our{' '}
          <a href="/refund-policy" className="text-indigo-600 font-semibold hover:underline">Refund Policy</a> for cancellation terms.
        </p>
      </LegalSection>

      <LegalSection title="6. User Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Post false, misleading, or fraudulent listings, reviews, or job postings.</li>
          <li>Upload content that is illegal, abusive, or infringes on another person's rights.</li>
          <li>Attempt to bypass, disrupt, or misuse the Platform's systems, including uploads and payment features.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Reviews & Ratings">
        <p>
          Reviews must reflect genuine experiences. Search2Service may moderate or remove reviews that are abusive,
          fake, or violate these Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Search2Service shall not be liable for any indirect, incidental,
          or consequential damages arising from your use of the Platform or any interaction with a Provider or
          Customer. See our{' '}
          <a href="/disclaimer" className="text-indigo-600 font-semibold hover:underline">Disclaimer</a> for further details.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          We reserve the right to suspend or terminate any account that violates these Terms, engages in fraudulent
          activity, or misuses the Platform.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
          of the courts in Lucknow, Uttar Pradesh.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:legal@search2service.in" className="text-indigo-600 font-semibold hover:underline">legal@search2service.in</a> or via our{' '}
          <a href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
