import React from 'react';
import { parseResponse } from './parseResponse';

/**
 * BotAnswer
 * Renders a structured answer card from raw AI text.
 * Sections:
 *  - Intro paragraph (if present)
 *  - Numbered steps
 *  - Solution banner (green)
 *  - Related concepts (purple chips)
 *  - Practice problems (blue pills)
 */
function BotAnswer({ rawText }) {
  const { intro, steps, solution, concepts, practice } = parseResponse(rawText);

  // Fallback: if parsing found nothing meaningful, just render plain text
  const hasStructure = steps.length > 0 || solution || concepts.length > 0;

  if (!hasStructure) {
    return (
      <div className="answer-card">
        <div className="answer-plain">{rawText}</div>
      </div>
    );
  }

  return (
    <div className="answer-card">

      {/* Intro */}
      {intro && (
        <div className="answer-intro">{intro}</div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="answer-steps">
          {steps.map((step, i) => (
            <div className="step-row" key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-text">
                {step.title && step.title !== `Step ${i + 1}` && (
                  <strong>{step.title}</strong>
                )}
                {step.body && (
                  <span className={step.title !== `Step ${i + 1}` ? 'step-body' : ''}>
                    {step.body}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solution banner */}
      {solution && (
        <div className="solution-banner">
          <div className="solution-check">✓</div>
          <span className="solution-text">Solution: {solution}</span>
        </div>
      )}

      {/* Related concepts */}
      {concepts.length > 0 && (
        <div className="concepts-section">
          <div className="concepts-label">Related Concepts</div>
          <div className="concept-chips">
            {concepts.map((c, i) => (
              <span className="chip" key={i}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Practice problems */}
      {practice.length > 0 && (
        <div className="practice-section">
          <div className="practice-label">Try these next</div>
          <div className="practice-problems">
            {practice.map((p, i) => (
              <span className="practice-pill" key={i}>{p}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default BotAnswer;