import type { PoseOption } from "@/types/preset";

export const POSE_LIBRARY: PoseOption[] = [
  {
    id: "hair-touch",
    promptDescription:
      "standing with one hand lightly touching hair, relaxed smile, weight on one hip",
  },
  {
    id: "sitting-laugh",
    promptDescription:
      "sitting cross-legged on the ground, leaning slightly forward, candid laugh",
  },
  {
    id: "look-back",
    promptDescription:
      "walking mid-stride, looking back over shoulder with a playful expression",
  },
  {
    id: "lean-wall",
    promptDescription:
      "leaning against a wall or railing, arms relaxed, looking off to the side pensively",
  },
  {
    id: "crouch",
    promptDescription:
      "crouching low, one knee up, direct eye contact with camera, confident expression",
  },
  {
    id: "three-quarter",
    promptDescription:
      "three-quarter turn, hands in pockets or holding an accessory, soft natural smile",
  },
  {
    id: "arms-up",
    promptDescription:
      "full body standing, arms stretched out or up, joyful and carefree expression",
  },
  {
    id: "seated-chin",
    promptDescription:
      "seated on steps or ledge, chin resting on hand, contemplative mood",
  },
  {
    id: "twirl",
    promptDescription:
      "mid-twirl with skirt or jacket flowing, dynamic movement, genuine laughter",
  },
  {
    id: "coffee-hold",
    promptDescription:
      "holding a coffee cup with both hands near face, warm smile, cozy and intimate",
  },
  {
    id: "walking-forward",
    promptDescription:
      "walking towards camera with purpose, one foot forward, confident stride",
  },
  {
    id: "side-profile",
    promptDescription:
      "elegant side profile, looking into the distance, wind in hair, serene expression",
  },
];

/** Shuffle and select `count` poses from the library. */
export function selectPoses(count: number): string[] {
  const shuffled = [...POSE_LIBRARY].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count).map((p) => p.promptDescription);
  while (selected.length < count) {
    selected.push(
      "natural, relaxed pose with confident expression, unique angle",
    );
  }
  return selected;
}
