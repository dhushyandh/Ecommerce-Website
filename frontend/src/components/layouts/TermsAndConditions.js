import MetaData from "./MetaData";

export default function TermsAndConditions() {
  return (
    <main className="legal-page">
      <MetaData title="Terms and Conditions" />
      <header className="legal-header">
        <p className="legal-eyebrow">VIPSTORE / STORE TERMS</p>
        <h1>Terms and Conditions</h1>
        <p className="legal-intro">
          These terms set the ground rules for using VIPSTORE and purchasing products through the store.
        </p>
        <p className="legal-updated">Last updated: September 4, 2026</p>
      </header>

      <div className="legal-layout">
        <nav className="legal-index" aria-label="Terms and conditions sections">
          <span>On this page</span>
          <a href="#using">Using VIPSTORE</a>
          <a href="#orders">Orders and payment</a>
          <a href="#returns">Returns and refunds</a>
          <a href="#content">Content and liability</a>
        </nav>

        <article className="legal-content">
          <section id="using">
            <h2>1. Using VIPSTORE</h2>
            <p>By accessing VIPSTORE, you agree to these terms and to use the service lawfully. You must provide accurate information, keep your account credentials confidential, and promptly update information that changes.</p>
            <p>You may not interfere with the store, attempt unauthorized access, submit harmful code, misuse another person&apos;s account, or use the service for fraudulent or unlawful activity.</p>
          </section>

          <section id="orders">
            <h2>2. Products, orders, and payment</h2>
            <p>Product information, images, prices, availability, and delivery estimates may change without notice. We try to keep listings accurate, but minor differences in appearance or display are possible.</p>
            <p>Submitting an order is a request to purchase. An order is accepted when VIPSTORE confirms it. We may cancel or limit an order if an item is unavailable, a listing contains an obvious error, payment cannot be authorized, or fraud or misuse is suspected.</p>
            <p>Payments are handled through the payment methods shown at checkout. You confirm that you are authorized to use the selected payment method and agree to provide current billing information.</p>
          </section>

          <section id="returns">
            <h2>3. Delivery, returns, and refunds</h2>
            <p>We deliver orders to the address supplied at checkout. Delivery dates are estimates and can be affected by carriers, weather, service interruptions, or events outside our control.</p>
            <p>Returns, replacements, and refunds are handled according to the return instructions and eligibility shown for the relevant product or order. Returned items may need to be unused and in their original condition. Approved refunds are sent to the original payment method, subject to processing times.</p>
          </section>

          <section>
            <h2>4. Accounts and termination</h2>
            <p>We may suspend or close an account if these terms are violated, the service is abused, or action is needed to protect customers and VIPSTORE. You may stop using the service at any time. Provisions that should reasonably continue after termination, including payment obligations and liability limits, will remain in effect.</p>
          </section>

          <section id="content">
            <h2>5. Content and intellectual property</h2>
            <p>VIPSTORE and its software, branding, text, images, and other materials belong to VIPSTORE or its licensors. You may use the site for personal shopping purposes, but may not copy, modify, distribute, or commercially exploit its materials without permission.</p>
          </section>

          <section>
            <h2>6. Disclaimers and liability</h2>
            <p>VIPSTORE is provided on an available basis. To the extent permitted by law, we do not promise that the service will always be uninterrupted, error-free, or free from harmful components. Nothing in these terms limits rights or remedies that cannot legally be limited.</p>
            <p>To the extent permitted by law, VIPSTORE is not responsible for indirect, incidental, or consequential losses arising from use of the service. Our responsibility for a specific order will not exceed the amount paid for that order, except where applicable law requires otherwise.</p>
          </section>

          <section>
            <h2>7. Changes and contact</h2>
            <p>We may revise these terms as the store changes. The updated version takes effect when posted here. Continued use of VIPSTORE after an update means you accept the revised terms.</p>
            <p>Questions about these terms can be raised through the VIPSTORE support channel.</p>
          </section>
        </article>
      </div>
    </main>
  );
}
