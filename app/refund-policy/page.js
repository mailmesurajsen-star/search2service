import { LegalPage, LegalSection } from '@/components/legal-page';

export const metadata = { title: 'Refund Policy — Search2Service' };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedDate="August 24, 2026">
      <LegalSection title="1. Service Bookings">
        <p>
          Search2Service is a marketplace connecting Customers with independent Providers. Payments for services
          booked directly with a Provider (repairs, consultations, hotel stays, etc.) are made to the Provider and
          are subject to that Provider's own cancellation and refund terms, unless otherwise stated on their profile.
          For any dispute, please contact the Provider directly, or reach our support team and we will help mediate.
        </p>
      </LegalSection>

      <LegalSection title="2. Premium Plan Subscription">
        <ul className="list-disc pl-5 space-y-1">
          <li>Premium plan payments are processed securely through our payment gateway and activate immediately upon successful payment verification.</li>
          <li>If a payment is deducted but Premium is not activated due to a technical error, please contact support within 7 days with your payment reference — we will verify and either activate your plan or issue a full refund.</li>
          <li>Once a Premium billing cycle has started and the plan has been actively used (e.g., priority placement shown in search), that cycle is non-refundable, except where required by law.</li>
          <li>You may switch back to the Basic (free) plan at any time; this stops future billing but does not refund the current cycle.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Failed or Duplicate Payments">
        <p>
          If you are charged more than once for the same Premium subscription due to a technical issue, the
          duplicate charge will be refunded to your original payment method within 7–10 business days of
          verification.
        </p>
      </LegalSection>

      <LegalSection title="4. How to Request a Refund">
        <p>
          Email <a href="mailto:billing@search2service.in" className="text-indigo-600 font-semibold hover:underline">billing@search2service.in</a> or use our{' '}
          <a href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact page</a> with your registered email and payment/order ID. Approved refunds are processed to
          the original payment method within 7–10 business days.
        </p>
      </LegalSection>

      <LegalSection title="5. Changes to This Policy">
        <p>
          We may update this Refund Policy periodically. The "Last updated" date above reflects the most recent
          revision.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
