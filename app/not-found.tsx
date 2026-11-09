import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center">
        <span className="pill-label">404</span>
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>We couldn&apos;t find that page</h1>
        <p className="lead">It may have moved. Try the home page instead.</p>
        <Link href="/" className="btn btn--primary">Back to home</Link>
      </div>
    </section>
  );
}
