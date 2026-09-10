import { Award, Download, ShieldCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/ui/PageTitle";
import { courses } from "../data/demo";
import { useDemo, getOrCreateCertificate } from "../lib/demoStore";

function generatePDF(
  certNo: string,
  hash: string,
  traineeName: string,
  courseTitle: string,
  issuedAt: string,
  score: number,
) {
  const date = new Date(issuedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fbff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f7f4;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="header" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#071426;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d2c40;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0969da;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#38bdf8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="900" height="640" fill="url(#bg)" rx="8"/>

  <!-- Decorative circles -->
  <circle cx="820" cy="80" r="120" fill="none" stroke="#0969da08" stroke-width="1"/>
  <circle cx="820" cy="80" r="80" fill="none" stroke="#0969da06" stroke-width="1"/>
  <circle cx="80" cy="560" r="100" fill="none" stroke="#38bdf808" stroke-width="1"/>

  <!-- Border -->
  <rect x="20" y="20" width="860" height="600" fill="none" stroke="#dce5ef" stroke-width="1" rx="6"/>
  <rect x="24" y="24" width="852" height="592" fill="none" stroke="#0969da15" stroke-width="0.5" rx="5"/>

  <!-- Top accent bar -->
  <rect x="24" y="24" width="852" height="4" fill="url(#accent)" rx="2"/>

  <!-- Header band -->
  <rect x="40" y="50" width="820" height="80" fill="url(#header)" rx="8"/>
  <text x="450" y="82" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="6" fill="#83d1dc" font-weight="600">INDIA METEOROLOGICAL DEPARTMENT</text>
  <text x="450" y="108" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#ffffff" font-weight="700" letter-spacing="3">CERTIFICATE OF COMPLETION</text>

  <!-- Decorative line -->
  <line x1="380" y1="150" x2="520" y2="150" stroke="#0969da" stroke-width="2"/>
  <circle cx="450" cy="150" r="4" fill="#0969da"/>

  <!-- Presented to -->
  <text x="450" y="185" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#7d9099" letter-spacing="2">PRESENTED TO</text>

  <!-- Trainee name -->
  <text x="450" y="230" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#172b43" font-weight="500">${traineeName}</text>

  <!-- Line under name -->
  <line x1="250" y1="248" x2="650" y2="248" stroke="#dce5ef" stroke-width="1"/>

  <!-- Course text -->
  <text x="450" y="285" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="#52657c">for successful completion of the course</text>

  <!-- Course title -->
  <text x="450" y="320" text-anchor="middle" font-family="Georgia, serif" font-size="19" fill="#0969da" font-weight="600">${courseTitle}</text>

  <!-- Details -->
  <text x="450" y="365" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#7d9099">Date of Issue: ${date}  |  Assessment Score: ${score}%</text>

  <!-- Seal area -->
  <circle cx="130" cy="490" r="45" fill="none" stroke="#0969da" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="130" cy="490" r="38" fill="#f0f7ff" stroke="#0969da30" stroke-width="1"/>
  <text x="130" y="486" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#0969da" font-weight="700" letter-spacing="1">CAPACITY</text>
  <text x="130" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#0969da" font-weight="700" letter-spacing="1">CONNECT</text>

  <!-- Signature lines -->
  <line x1="280" y1="480" x2="420" y2="480" stroke="#dce5ef" stroke-width="1"/>
  <text x="350" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#7d9099">Training Director</text>

  <line x1="480" y1="480" x2="620" y2="480" stroke="#dce5ef" stroke-width="1"/>
  <text x="550" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#7d9099">IMD Administrator</text>

  <!-- Certificate ID and hash -->
  <rect x="40" y="540" width="820" height="50" fill="#f7fafc" rx="6"/>
  <text x="60" y="562" font-family="monospace" font-size="10" fill="#52657c">Certificate ID: ${certNo}</text>
  <text x="60" y="578" font-family="monospace" font-size="10" fill="#52657c">Verification Hash: ${hash}</text>
  <text x="840" y="570" text-anchor="end" font-family="Inter, sans-serif" font-size="9" fill="#93a4ad">Verify at: capacity-connect.vercel.app/verify</text>
</svg>`;

  const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d")!;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 1800, 1280);
    URL.revokeObjectURL(svgUrl);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${certNo}.png`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };
  img.src = svgUrl;
}

export function Certificates() {
  const { learning, profiles } = useDemo();
  const earned = courses.filter(
    (course) =>
      learning[course.id]?.completed.length === 3 &&
      (learning[course.id]?.score || 0) >= 70 &&
      learning[course.id]?.issuedAt,
  );

  return (
    <>
      <PageTitle
        title="Certificates"
        desc="Earned by completing a learning path and passing its knowledge check."
        action={
          <Link className="secondary" to="/trainee/certificate-verify">
            <ShieldCheck size={15} />
            Verify a certificate
          </Link>
        }
      />
      {!earned.length && (
        <section className="panel empty-state">
          <Award size={40} />
          <h2>Your next achievement starts here</h2>
          <p>
            Complete three notes and pass a course assessment with at least 70%
            to earn a demo certificate.
          </p>
          <Link className="primary" to="/trainee/courses">
            Explore learning paths
          </Link>
        </section>
      )}
      <div className="certificate-grid">
        {earned.map((course) => {
          const record = learning[course.id];
          const name = profiles.trainee?.name || "Vikram Kumar";
          const cert = getOrCreateCertificate(
            course.id,
            course.title,
            name,
            record.score!,
          );
          return (
            <article className="certificate panel" key={course.id}>
              <div className="cert-seal">
                <Award size={29} />
              </div>
              <p className="eyebrow">CERTIFICATE OF COMPLETION</p>
              <h2>{course.title}</h2>
              <p>
                Presented to <strong>{name}</strong>
              </p>
              <p>
                All notes completed · Score {record.score}% ·{" "}
                {new Date(record.issuedAt!).toLocaleDateString("en-IN")}
              </p>
              <div className="cert-footer">
                <div>
                  <span>{cert.certificateNo}</span>
                  <small style={{ display: "block", marginTop: 2, fontSize: 9, color: "#93a4ad" }}>
                    Hash: {cert.hash.slice(0, 16)}...
                  </small>
                </div>
                <div className="cert-actions">
                  <button
                    className="secondary"
                    onClick={() =>
                      generatePDF(
                        cert.certificateNo,
                        cert.hash,
                        name,
                        course.title,
                        cert.issuedAt,
                        cert.score,
                      )
                    }
                  >
                    <Download size={15} />
                    Download PDF
                  </button>
                  <Link
                    className="secondary"
                    to="/trainee/certificate-verify"
                  >
                    <ShieldCheck size={15} />
                    Verify
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
