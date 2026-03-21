# Deferred Improvements Backlog

Created: 2026-03-21
Status: Parked for future consideration

---

## #18 — "Conditions Delivering This Week" Quick Filter

**Category:** Search & Navigation
**Skill:** `frontend-engineering-patterns`

**Description:** Add a quick-action on the home page: "What delivers this week?" based on the currently entered GA. Shows all conditions whose recommended delivery window includes the current GA. A resident on L&D at 39w3d can instantly see every condition that might be in the delivery window right now.

**Implementation notes:**
- Filter `allConditions` where `guidelineRecommendations[0].timing.type === "range"` and `range.earliest <= currentGA <= range.latest`
- Could be a floating action button or a section on the home page
- Needs a way to set "current GA" globally (currently only exists in the calculator state)
- Consider making GA a global context so it persists across pages

**Estimated complexity:** Medium (needs global GA state + new filtered view)

---

## #23 — Interactive Evidence Map

**Category:** Visual Design & Polish
**Skill:** `data-visualization`

**Description:** Create a visual evidence map showing the relationship between evidence quality and the number of conditions at each level. A bubble chart or treemap where: the size represents the number of conditions, the color represents evidence strength (green -> high, red -> very low), and clicking a bubble shows the conditions in that group. This gives an instant visual sense of where the evidence is strong vs. where it's thin.

**Implementation notes:**
- Aggregate `allConditions` by `guidelineRecommendations[0].grade.strength`
- Recharts TreeMap or a custom D3 bubble visualization
- Could live on the methodology page or as its own `/evidence-map` route
- Clickable bubbles should link to filtered conditions list

**Estimated complexity:** Medium (data aggregation is simple, visualization design is the challenge)

---

## #25 — Teaching Mode Enhancement: Interactive Quiz Cards

**Category:** Teaching & Education
**Skill:** `form-engineering`, `frontend-engineering-patterns`

**Description:** In teaching mode, add optional "Test Yourself" cards at the end of condition detail pages. Multiple-choice questions about the condition: "At what GA does ACOG recommend delivery for preeclampsia with severe features?" with the answer revealed on click. The questions are generated from the condition data (GA ranges, evidence grades, risk statistics). This makes Kairos a study tool for board prep, not just a clinical reference.

**Implementation notes:**
- Auto-generate questions from `ObstetricCondition` data: GA window, evidence grade, risk statistics, past-40-weeks status, delivery route
- Question types: GA range identification, evidence grade matching, risk statistic interpretation, guideline body attribution
- Store quiz progress in localStorage (optional)
- Only visible when teaching mode is enabled
- Consider a separate `/quiz` page for randomized cross-condition quizzing

**Estimated complexity:** High (question generation logic, interactive UI, optional persistence)
