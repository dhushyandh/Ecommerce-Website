import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="row wrapper" style={{ minHeight: "60vh", alignItems: "center" }}>
      <div className="col-12 text-center">
        <img
          src="/images/page_not_found.svg"
          alt="Page not found"
          style={{ maxWidth: 420, width: "100%", marginBottom: 20 }}
        />
        <h2 style={{ marginBottom: 10 }}>Page not found</h2>
        <p style={{ color: "#666", marginBottom: 20 }}>
          The page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
