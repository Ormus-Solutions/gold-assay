export function assayQuestions(claim: string) {
  return {
    journey_state: {
      type: "choice" as const,
      instructions: `Given the screen text, does the claimed journey hold: ${claim}`,
      criteria: {
        green: "Claim visibly satisfied; no blocking errors",
        yellow: "Partial progress; claim not fully met",
        red: "Claim failed or wrong screen",
        blocked: "Modal, auth wall, or spinner preventing judgment",
      },
    },
    claim_match: {
      type: "score" as const,
      instructions: "How strongly the visible UI matches the claim",
      criteria: ["No match", "Weak", "Partial", "Strong", "Exact"],
    },
    error_banner: {
      type: "boolean" as const,
      instructions: "An error, toast, or failure banner is visible",
    },
    destructive_visible: {
      type: "boolean" as const,
      instructions: "A destructive confirm (delete, pay, wipe) is the primary CTA",
    },
  };
}

export type AssayAnswers = {
  journey_state: { choice: "green" | "yellow" | "red" | "blocked" };
  claim_match: { score: number };
  error_banner: { probability: number };
  destructive_visible: { probability: number };
};

export type AssayResult = {
  state: AssayAnswers["journey_state"]["choice"];
  ship: boolean;
  notes: string[];
};

export function interpretAssay(a: AssayAnswers): AssayResult {
  const notes: string[] = [];
  if (a.error_banner.probability > 0.6) notes.push("error_banner");
  if (a.destructive_visible.probability > 0.6) notes.push("destructive_cta");

  const ship =
    a.journey_state.choice === "green" &&
    a.claim_match.score >= 2.5 &&
    a.error_banner.probability < 0.5;

  return { state: a.journey_state.choice, ship, notes };
}
