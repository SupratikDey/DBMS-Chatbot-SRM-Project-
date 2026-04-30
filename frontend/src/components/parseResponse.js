/**
 * parseResponse.js
 *
 * Parses the raw AI text response into structured sections:
 *   - steps:    Array of { title, body } objects
 *   - solution: The final answer string (e.g. "x = 3")
 *   - concepts: Array of concept strings
 *   - practice: Array of practice problem strings
 *   - intro:    Any leading text before the steps
 *
 * Strategy:
 *  1. Strip all markdown bold (**text**) → plain text
 *  2. Split on step markers ("Step 1", "Step 2:", etc.)
 *  3. Look for "Solution:" section
 *  4. Look for "Related Concepts:" section → extract as chips
 *  5. Look for practice problems (bullet list or inline)
 */

export function parseResponse(raw) {
  if (!raw) return { intro: '', steps: [], solution: '', concepts: [], practice: [] };

  // 1. Normalise markdown bold markers
  let text = raw.replace(/\*\*/g, '');

  // 2. Extract Related Concepts block
  const conceptsMatch = text.match(
    /Related Concepts[:\s]+([\s\S]*?)(?=To practice|Try these|$)/i
  );
  let concepts = [];
  if (conceptsMatch) {
    const block = conceptsMatch[1];
    // Could be numbered list "1. Subtraction..." or comma / newline separated
    concepts = block
      .split(/\n|,|\d+\.\s/)
      .map(s => s.replace(/^[-*\s]+/, '').trim())
      .filter(s => s.length > 3 && s.length < 80);
    text = text.replace(conceptsMatch[0], '');
  }

  // 3. Extract practice problems block
  const practiceMatch = text.match(
    /To practice[\s\S]*?(?:try solving|problems?|exercises?)[\s\S]*?:([\s\S]*?)(?=\n\n|$)/i
  );
  let practice = [];
  if (practiceMatch) {
    practice = practiceMatch[1]
      .split(/\*|•|\n/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 40);
    text = text.replace(practiceMatch[0], '');
  }

  // 4. Extract Solution line
  const solutionMatch = text.match(/Solution[:\s]+([^\n.]+)/i);
  let solution = '';
  if (solutionMatch) {
    solution = solutionMatch[1].trim();
    text = text.replace(solutionMatch[0], '');
  }

  // 5. Split into steps on "Step N" markers
  const stepRegex = /Step\s+\d+[:\s]*/gi;
  const parts = text.split(stepRegex).map(p => p.trim()).filter(Boolean);

  // The first part (before any "Step 1") is the intro
  const stepMatches = [...text.matchAll(/Step\s+(\d+)[:\s]*/gi)];
  let intro = '';
  let steps = [];

  if (stepMatches.length === 0) {
    // No explicit steps — try to split on double newlines as paragraphs
    const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    if (paras.length <= 1) {
      intro = text.trim();
    } else {
      intro = paras[0];
      steps = paras.slice(1).map((p, i) => ({
        title: `Step ${i + 1}`,
        body: p,
      }));
    }
  } else {
    intro = parts[0] && !text.match(/^Step\s+1/i) ? parts[0] : '';
    const stepParts = stepMatches.length > 0 ? parts.slice(intro ? 1 : 0) : parts;

    steps = stepParts.map((body, i) => {
      // Try to extract a title from the first sentence / bolded fragment
      const firstNewline = body.indexOf('\n');
      const firstPeriod = body.search(/\.\s/);
      let title = `Step ${i + 1}`;
      let rest = body;

      // If the body starts with a descriptive phrase (no period in first 60 chars), use it as title
      const shortPhrase = body.split('\n')[0];
      if (shortPhrase && shortPhrase.length < 60 && firstNewline !== -1) {
        title = shortPhrase.trim();
        rest = body.slice(firstNewline).trim();
      } else if (firstPeriod > 0 && firstPeriod < 60) {
        title = body.slice(0, firstPeriod + 1).trim();
        rest = body.slice(firstPeriod + 1).trim();
      }

      return { title, body: rest || body };
    });
  }

  // 6. Inline clean-up — remove leftover numbering like "1." at line start
  steps = steps.map(s => ({
    ...s,
    body: s.body.replace(/^\d+\.\s*/gm, '').trim(),
  }));

  return { intro, steps, solution, concepts, practice };
}