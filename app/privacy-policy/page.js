import { LegalPage, LegalSection } from '@/components/legal-page';

export const metadata = { title: 'Privacy Policy — Search2Service' };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedDate="August 24, 2026">
      <LegalSection title="1. Introduction">
        <p>
          Search2Service ("we", "us", "our") operates the Search2Service platform, connecting customers with local
          service providers, job listings, and government service assistance across India. This Privacy Policy
          explains what information we collect, how we use it, and the choices you have.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect information you provide directly, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account details — name, email address, phone number, and password (stored securely as a hash).</li>
          <li>Business profile information — for Providers, including services, pricing, location, and business documents.</li>
          <li>Job Seeker details — including address, contact information, resume, and profile photo, when you register as a Job Seeker.</li>
          <li>Uploaded media — photos, banners, and PDF documents you choose to upload.</li>
          <li>Payment details — for Premium plan checkout, processed securely through our payment gateway partner (Razorpay); we do not store your card or bank details.</li>
          <li>Communications — messages sent through our Contact form, chat assistant, reviews, and bookings.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your account and business or job seeker profile.</li>
          <li>To connect customers with relevant providers and display accurate search results.</li>
          <li>To process bookings, reviews, and Premium plan payments.</li>
          <li>To send important notices about your account, bookings, or platform updates.</li>
          <li>To improve our platform, prevent fraud, and enforce our Terms & Conditions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sharing of Information">
        <p>
          We do not sell your personal information. We share information only: (a) with the provider or customer
          involved in a booking or inquiry, so they can contact you; (b) with payment processors to complete Premium
          plan transactions; (c) when required by law or to protect the safety of our users and platform.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We use industry-standard measures — including password hashing, encrypted authentication tokens, and
          access controls — to protect your data. However, no method of transmission over the internet is 100%
          secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Choices">
        <p>
          You can update your profile information, remove uploaded photos or your resume, or request deletion of
          your account at any time by contacting us at{' '}
          <a href="mailto:privacy@search2service.in" className="text-indigo-600 font-semibold hover:underline">privacy@search2service.in</a>.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be reflected by updating the
          "Last updated" date above. Continued use of Search2Service after changes means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact Us">
        <p>
          For any privacy-related questions, please reach out via our{' '}
          <a href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact page</a> or email{' '}
          <a href="mailto:privacy@search2service.in" className="text-indigo-600 font-semibold hover:underline">privacy@search2service.in</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
