import { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Award,
  ShieldCheck,
  Hash,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import { PageTitle } from "../components/ui/PageTitle";
import { useDemo } from "../lib/demoStore";

export function CertificateVerify() {
  const { certificates } = useDemo();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<"found" | "not-found" | null>(null);
  const [foundCert, setFoundCert] = useState<typeof certificates[0] | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const cert = certificates.find(
      (c) =>
        c.certificateNo.toLowerCase() === q ||
        c.hash.toLowerCase() === q,
    );
    if (cert) {
      setResult("found");
      setFoundCert(cert);
    } else {
      setResult("not-found");
      setFoundCert(null);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-hero">
        <div className="verify-hero-content">
          <ShieldCheck size={48} />
          <h1>Certificate Verification</h1>
          <p>
            Verify the authenticity of any Capacity Connect / IMD certificate
            by entering the certificate number or verification hash.
          </p>
          <form className="verify-form" onSubmit={handleVerify}>
            <div className="verify-input-group">
              <Search size={18} />
              <input
                type="text"
                placeholder="Enter Certificate ID or Hash Code..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResult(null);
                }}
              />
              <button className="primary" type="submit">
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>

      {result === "found" && foundCert && (
        <div className="verify-result verified">
          <div className="verify-result-icon">
            <CheckCircle2 size={48} />
          </div>
          <h2>Certificate Verified</h2>
          <p>This certificate is authentic and was issued by Capacity Connect.</p>

          <div className="cert-verify-card panel">
            <div className="cert-verify-header">
              <Award size={28} />
              <div>
                <h3>{foundCert.courseTitle}</h3>
                <p>Certificate of Completion</p>
              </div>
            </div>
            <div className="cert-verify-details">
              <div className="verify-detail">
                <User size={14} />
                <div>
                  <small>Issued To</small>
                  <strong>{foundCert.traineeName}</strong>
                </div>
              </div>
              <div className="verify-detail">
                <BookOpen size={14} />
                <div>
                  <small>Course</small>
                  <strong>{foundCert.courseTitle}</strong>
                </div>
              </div>
              <div className="verify-detail">
                <Calendar size={14} />
                <div>
                  <small>Date of Issue</small>
                  <strong>
                    {new Date(foundCert.issuedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              </div>
              <div className="verify-detail">
                <Hash size={14} />
                <div>
                  <small>Certificate ID</small>
                  <strong>{foundCert.certificateNo}</strong>
                </div>
              </div>
              <div className="verify-detail">
                <ShieldCheck size={14} />
                <div>
                  <small>Verification Hash</small>
                  <strong className="hash-code">{foundCert.hash}</strong>
                </div>
              </div>
              <div className="verify-detail">
                <CheckCircle2 size={14} />
                <div>
                  <small>Assessment Score</small>
                  <strong>{foundCert.score}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result === "not-found" && (
        <div className="verify-result not-found">
          <div className="verify-result-icon error">
            <XCircle size={48} />
          </div>
          <h2>Certificate Not Found</h2>
          <p>
            No certificate matches the entered ID or hash. Please check and try
            again.
          </p>
        </div>
      )}

      {!result && (
        <div className="verify-info">
          <div className="panel verify-info-card">
            <h3>How to verify</h3>
            <ol>
              <li>Enter the Certificate ID (e.g., CC-RADAR-20260905-A1B2C3) or the unique verification hash.</li>
              <li>Click "Verify" to check the certificate's authenticity.</li>
              <li>The system will display the certificate details if it exists in our records.</li>
            </ol>
          </div>
          <div className="panel verify-info-card">
            <h3>Need help?</h3>
            <p>
              If you're having trouble verifying a certificate, contact the
              training office at training@imd.gov.in with the certificate
              details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
