// Shared by Nav.astro and ProgressRail.astro so both always point at the
// same waypoints — add a section once here, it appears in both places.
export const SECTIONS = [
  { href: "#building", label: "The Building" },
  { href: "#spaces", label: "Spaces" },
  { href: "#membership", label: "Membership" },
  { href: "#location", label: "Location" },
] as const;
