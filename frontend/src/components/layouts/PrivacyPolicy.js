import MetaData from "./MetaData";

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <MetaData title="Privacy Policy" />
      <header className="legal-header">
        <p className="legal-eyebrow">VIPSTORE / YOUR DATA</p>
        <h1>Privacy Policy</h1>
        <p className="legal-intro">
          This policy explains what information VIPSTORE collects, why we use it, and the choices available to you.
        </p>
        <p className="legal-updated">Last updated: September 4, 2026</p>
      </header>

      <div className="legal-layout">
        <nav className="legal-index" aria-label="Privacy policy sections">
          <span>On this page</span>
          <a href="#information">Information we collect</a>
          <a href="#use">How we use information</a>
          <a href="#sharing">Sharing and security</a>
          <a href="#choices">Your choices</a>
        </nav>

        <article className="legal-content">
          <section id="information">
            <h2>1. Information we collect</h2>
            <p>We collect information you provide when you create an account, place an order, contact us, or update your profile. This may include your name, email address, delivery address, phone number, account credentials, and order details.</p>
            <p>When you sign in with Google, we receive the profile information Google makes available, such as your name, email address, and profile photo. We do not receive your Google password.</p>
            <p>We also collect basic technical information needed to keep the store working, such as browser details, device information, and request logs.</p>
          </section>

          <section id="use">
            <h2>2. How we use information</h2>
            <ul>
              <li>Process orders, payments, delivery, returns, and account requests.</li>
              <li>Authenticate your account and protect the store from fraud or abuse.</li>
              <li>Respond to questions and provide customer support.</li>
              <li>Improve our products, checkout experience, and site reliability.</li>
              <li>Send service messages about orders, security, or important account changes.</li>
            </ul>
          </section>

          <section id="sharing">
            <h2>3. Sharing and security</h2>
            <p>We share only the information needed to operate the service with trusted providers such as payment processors, delivery partners, cloud hosting, authentication providers, and image-storage services. We do not sell your personal information.</p>
            <p>We use reasonable technical and organizational safeguards, including authenticated access and encrypted connections where supported. No online service can guarantee absolute security, so please protect your password and contact us promptly about suspicious activity.</p>
          </section>

          <section>
            <h2>4. Cookies and similar technologies</h2>
            <p>VIPSTORE may use cookies or local storage to keep you signed in, remember cart and checkout details, and understand basic site usage. Blocking these technologies may affect account, cart, or checkout functionality.</p>
          </section>

          <section id="choices">
            <h2>5. Your choices and rights</h2>
            <p>You can review or update profile information from your account, request help with your personal data, or ask us to delete your account where we are not required to retain information for legal, security, or transaction-record purposes.</p>
            <p>To make a privacy request, use the contact details provided through the VIPSTORE support channel. We may need to verify your identity before completing the request.</p>
          </section>

          <section>
            <h2>6. Retention and changes</h2>
            <p>We retain information for as long as needed to provide the service, complete transactions, resolve disputes, meet legal obligations, and enforce our agreements. We may update this policy from time to time and will post the revised version on this page.</p>
          </section>
        </article>
      </div>
    </main>
  );
}
