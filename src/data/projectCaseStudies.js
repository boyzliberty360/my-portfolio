// Fallback case studies for projects published before the admin carried
// case-study fields. Anything entered in the admin takes precedence, and a
// project with neither simply renders without a case study.
//
// Written for a reader with no technical background: say what the product does
// and why the hard part was hard, without assuming any jargon.
export const projectCaseStudies = {
  Trusta: {
    type: "Online payments",
    problem:
      "Buying from a stranger online comes down to who goes first. The buyer does not want to pay before the goods arrive, and the seller does not want to send anything before being paid. Most deals fall apart right there.",
    solution:
      "Trusta holds the buyer's money safely in the middle. The seller can see the money is real and waiting, so they ship with confidence, and the funds are only released once the agreed conditions are met. Both sides can see exactly what stage the deal is at.",
    role:
      "I built all of it — the screens both people use, the system that tracks each deal, the connection to the bank, and the security around the money.",
    architecture:
      "Each deal moves through a fixed set of clearly named stages, and it can only move in ways that make sense. Every step is written down permanently, so if anyone ever disputes what happened, there is a complete record.",
    challenge:
      "Anything involving money can fail halfway through. A payment notification can arrive twice, a customer can double-tap a button, or the bank's system can go quiet mid-transaction. Any of those can mean somebody is charged twice or money is released that was never actually collected.",
    response:
      "Every action carries a unique ticket, so if the same request arrives twice the second one is recognised and ignored rather than repeated. Messages that claim to come from the bank are checked to prove they genuinely did. And a routine job regularly compares our records against the bank's, so any mismatch shows up as an alert instead of quietly costing someone money.",
    quality: [
      "The same payment can never be taken twice",
      "Fake payment notifications are detected and rejected",
      "Our records are automatically checked against the bank's",
      "A permanent log of every step of every deal",
    ],
  },
  DoctorCare: {
    type: "Healthcare",
    problem:
      "Finding a doctor you can trust, booking a time that works, and keeping your medical history somewhere you can actually find it usually means three separate systems and a lot of phone calls.",
    solution:
      "DoctorCare puts all of it in one place: search for a verified doctor, book an appointment, attend the consultation, and keep your records together afterwards.",
    role: "I built the screens patients use, the system storing the information, and the booking process connecting them.",
    architecture:
      "The product is organised around four clear areas — doctors, patients, appointments, and medical records — so each can be improved without disturbing the others.",
    challenge:
      "In healthcare, small interface mistakes have real consequences. A confusing booking screen wastes a doctor's day, and medical records showing up where they should not is far more serious.",
    response:
      "Navigation stays predictable so nobody gets lost, anything important asks for confirmation before it happens, and personal records are kept off any screen that has no reason to display them.",
    quality: [
      "Booking works properly on a phone",
      "Forms explain clearly when something is wrong",
      "Medical records are only shown where they are needed",
    ],
  },
};
