// Fallback case studies for projects published before the admin carried
// case-study fields. Anything entered in the admin takes precedence, and a
// project with neither simply renders without a case study.
//
// Written for an engineer reading it: name the actual mechanism, then the
// trade-off behind it. Every field is optional -- a project without real
// material for a section renders without that section rather than with filler.
export const projectCaseStudies = {
  Trusta: {
    type: "Escrow payments",
    problem:
      "Peer-to-peer trade stalls on who moves first. The buyer will not pay before delivery, the seller will not ship before payment, and neither side has a record either of them would accept afterwards.",
    solution:
      "Trusta holds funds against an explicit deal state machine. The seller can verify the money is collected before shipping, release only happens once delivery conditions are met, and every transition is written to an append-only event log both parties can read.",
    role:
      "Sole engineer. Next.js App Router front end, the Prisma and PostgreSQL domain layer, the Monnify payment integration, the reconciliation and deadline jobs, and the authorization rules around every money-moving action.",
    architecture:
      "Deal status is a closed union of ten states with an explicit allowed-transition map, and every write goes through an assertion against it, so an invalid transition throws rather than silently corrupting a deal. Payment callbacks arrive at a signature-verified webhook, and a reconciliation job scheduled with pg_cron inside Supabase re-checks the provider's own status API every two minutes.",
    challenge:
      "Payment systems fail in the middle. A webhook can arrive twice, out of order, or be forged; a client can double-submit; the provider can accept a transfer and go quiet. Any of those can double-charge a buyer or release funds that were never actually collected. The subtler one was ordering: an early version could cancel a deal for seller silence in the same job pass that confirmed the shipment.",
    response:
      "Mutations are wrapped in request-level idempotency keyed on (scope, key) with a unique constraint that serialises concurrent duplicates and replays the stored 2xx response on retry. Webhook signatures are verified with a constant-time compare, and no webhook is ever trusted alone for a money-moving decision — the deal service requeries the provider's transaction status API before it transitions anything. Deadline enforcement was moved to run after reconciliation in the job, so a payment landing this cycle is already reflected before any deal is judged abandoned.",
    tradeoffs: [
      {
        decision: "Trusting the webhook payload",
        chose: "Treat the webhook as a notification and requery the provider's status API before transitioning",
        rejected: "Acting directly on the webhook body",
        because:
          "A webhook is attacker-reachable input. Verifying the signature proves origin, not that the state it describes is still current. The extra round trip costs latency on a path where being wrong costs money.",
      },
      {
        decision: "Missing signature in sandbox",
        chose: "Accept unsigned in sandbox but flag signed:false for distinct audit logging; reject outright in production",
        rejected: "Rejecting unsigned requests in every environment",
        because:
          "The provider only signs production notifications, so a uniform rule would make sandbox testing impossible. Whenever a signature is present it is always verified and a mismatch is always rejected — the relaxation is on absence, never on mismatch.",
      },
      {
        decision: "Claiming an idempotency key",
        chose: "Read the existing record first, fall back to insert-and-catch on the unique constraint",
        rejected: "Insert-first and catch the constraint violation every time",
        because:
          "Retries are the common case, not the exception. Insert-first turns every legitimate retry into a database error, which buries the real conflicts in log noise. The constraint still guards the narrow race between read and write.",
      },
      {
        decision: "Scheduling reconciliation",
        chose: "pg_cron inside Supabase calling the job endpoint over pg_net",
        rejected: "Vercel Cron",
        because:
          "Reconciliation needs a two-minute cadence and the hosting plan's cron frequency is capped well above that. Moving the schedule into the database keeps it independent of the deploy platform's limits.",
      },
    ],
    snippet: {
      label: "The transition map every deal write is asserted against",
      language: "typescript",
      code: `export const allowedDealTransitions = {
  DRAFT:            ["AWAITING_PAYMENT", "EXPIRED", "CANCELLED"],
  AWAITING_PAYMENT: ["FUNDED", "EXPIRED", "CANCELLED", "FAILED"],
  // CANCELLED is reachable from FUNDED so a paid deal the
  // seller never ships can be unwound and refunded. Only the
  // scheduled job and an admin take this edge.
  FUNDED:           ["DELIVERED", "DISPUTED", "FAILED", "CANCELLED"],
  DELIVERED:        ["RELEASE_PENDING", "DISPUTED"],
  RELEASE_PENDING:  ["COMPLETED", "DISPUTED", "FAILED"],
  COMPLETED:        [],
  DISPUTED:         ["COMPLETED", "CANCELLED"],
  CANCELLED:        [],
  EXPIRED:          [],
  FAILED:           ["RELEASE_PENDING"],
} as const satisfies Record<DealStatus, readonly DealStatus[]>;

export function assertDealTransition(from: DealStatus, to: DealStatus) {
  if (!canTransitionDeal(from, to)) {
    throw new Error(\`Invalid deal transition: \${from} -> \${to}\`);
  }
}`,
    },
    quality: [
      "Replayed requests return the cached response, never a second side effect",
      "Webhook signatures verified with a constant-time compare",
      "Provider status requeried before any deal transition",
      "Invalid state transitions throw instead of writing",
      "Append-only event log behind every deal",
    ],
    lessons: [
      "Writing the state machine as data before writing any handler made the illegal transitions obvious at review time rather than in production.",
      "Ordering inside a scheduled job is a correctness property, not a style choice. The abandoned-deal bug was entirely a matter of which function ran first.",
      "Comments explaining why a security rule is relaxed are worth more than the rule itself — they are what stops the next person removing the exception or widening it.",
    ],
    next: [
      "Property-based tests over the transition map so unreachable and absorbing states are proven, not eyeballed",
      "Replace the polling reconciliation with a durable workflow so retries survive a deploy mid-flight",
    ],
  },
  DoctorCare: {
    type: "Healthcare",
    problem:
      "Finding a verified doctor, booking a slot that actually exists, and keeping the resulting records somewhere retrievable normally means three disconnected systems and a phone call to reconcile them.",
    solution:
      "One flow covering search, booking, consultation, and the record trail afterwards, with doctor verification state modelled explicitly rather than assumed.",
    role:
      "Built the patient-facing interface, the data model behind it, and the booking flow connecting the two.",
    architecture:
      "Four bounded domains — doctors, patients, appointments, and records — with the coupling between them kept at the API boundary, so scheduling rules can change without touching how records are stored or exposed.",
    challenge:
      "In healthcare an interface mistake has a cost outside the software. An ambiguous booking screen wastes a clinician's day, and a record rendered on a route that had no reason to load it is a disclosure, not a bug report.",
    response:
      "Records are fetched per route rather than hydrated into shared state, so a screen that has no reason to hold patient data never receives it. Destructive and scheduling actions require explicit confirmation, and form validation reports the specific field and reason instead of a generic failure.",
    tradeoffs: [
      {
        decision: "Where patient records live in client state",
        chose: "Fetch per route, scoped to the screen that needs them",
        rejected: "Hydrating a shared patient store once at login",
        because:
          "A global store makes every future screen a potential disclosure surface, and the mistake is invisible in review because nothing looks wrong at the call site. Per-route fetching costs a request and makes over-exposure a visible change.",
      },
    ],
    quality: [
      "Booking flow usable on a phone, not just responsive at it",
      "Validation errors name the field and the reason",
      "Records scoped to the routes that need them",
    ],
    lessons: [
      "Modelling doctor verification as explicit state rather than a boolean flag made the pending and rejected cases something the interface had to handle, instead of something it quietly rendered as verified.",
    ],
    next: [
      "Audit logging on record access, so disclosure is detectable after the fact and not only preventable before it",
    ],
  },
};
