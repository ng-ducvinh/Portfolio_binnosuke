import certCCNA from "../../assets/certificates/ccna.jpg";
import certV1TCTF from "../../assets/certificates/v1t-ctf-2026.png";
import certKasperskyCTF from "../../assets/certificates/kaspersky-ctf-2026.jpg";
import certHonorableStudent from "../../assets/certificates/honorable-student-fall2025.jpg";

import type { CertificateCategory } from "../types";

const certificates: CertificateCategory[] = [
  {
    id: "professional",
    items: [
      {
        title: "CCNA Course Completion (Excellent Grade) – VnPro Training Center",
        image: certCCNA,
      },
    ],
  },
  {
    id: "competitions",
    items: [
      {
        title: "V1T CTF 2026 – Participant (Rank 117/951, Team MIGHTY_WARRIORS)",
        image: certV1TCTF,
      },
      {
        title: "Kaspersky CTF 2026 – Participant (Team MIGHTY_WARRIORS)",
        image: certKasperskyCTF,
      },
    ],
  },
  {
    id: "academic",
    items: [
      {
        title: "Honorable Student of Trimester (Fall 2025) – FPT University",
        image: certHonorableStudent,
      },
    ],
  },
];

export default certificates;
