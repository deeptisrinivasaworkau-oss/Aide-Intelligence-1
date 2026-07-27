import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Explore executive oversight, capacity, workload, operational decision support and external intelligence use cases.";

export const metadata: Metadata = {
  title: "Use Cases",
  description,
  openGraph: { title: "Use Cases | Aide Intelligence", description },
};

const useCases = [
  {
    id: "executive-oversight",
    number: "01",
    eyebrow: "Executive oversight",
    heading: "Maintain a clear view of activity, pressure and priorities.",
    detail:
      "Bring together selected organisational signals to help leadership teams recognise material operating changes and direct attention appropriately.",
    questions: [
      "Where is operating pressure increasing?",
      "Which changes are material enough to review?",
      "What should be discussed at the next leadership meeting?",
    ],
  },
  {
    id: "capacity",
    number: "02",
    eyebrow: "Capacity and workload",
    heading: "Recognise patterns that may indicate constrained capacity.",
    detail:
      "Review organisational workload, meeting and after-hours activity trends to identify areas that may merit further investigation or support.",
    questions: [
      "Is workload pressure concentrated in particular functions?",
      "Are after-hours patterns increasing over time?",
      "Where may resource allocation need review?",
    ],
  },
  {
    id: "decision-support",
    number: "03",
    eyebrow: "Operational decision support",
    heading: "Support planning with objective organisational signals.",
    detail:
      "Use structured information to inform prioritisation, resource planning and operating discussions while preserving human judgement and context.",
    questions: [
      "Which operational issues require leadership attention?",
      "What evidence supports a change in priorities?",
      "Where would further context improve a decision?",
    ],
  },
  {
    id: "external",
    number: "04",
    eyebrow: "External intelligence",
    heading: "Bring relevant external change into the decision environment.",
    detail:
      "Connect selected news, competitor developments and market signals to the internal operating context.",
    questions: [
      "What external changes may affect current priorities?",
      "Which competitor developments warrant review?",
      "How might market context change an operational decision?",
    ],
  },
];

export default function UseCasesPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> Use cases
            </p>
            <h1>
              Intelligence for
              <br />
              <em>operational leadership.</em>
            </h1>
            <p className="lede">
              Aide Intelligence is designed for SME owners, managing directors,
              chief operating officers and functional leaders who require a
              clearer, more objective view of organisational activity.
            </p>
          </div>
          <div className="role-stack reveal">
            <span>SME owners</span>
            <span>Managing directors</span>
            <span>COOs</span>
            <span>Functional leaders</span>
          </div>
        </div>
      </section>

      {useCases.map((useCase) => (
        <section className="section use-detail" id={useCase.id} key={useCase.id}>
          <div className="shell use-detail-grid">
            <div className="use-number reveal">{useCase.number}</div>
            <div className="section-heading compact reveal">
              <p className="eyebrow">
                <span></span> {useCase.eyebrow}
              </p>
              <h2>{useCase.heading}</h2>
              <p>{useCase.detail}</p>
            </div>
            <div className="use-outcomes reveal">
              <span>Potential leadership questions</span>
              <ul>
                {useCase.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="section responsible-page">
        <div className="shell responsible-page-inner reveal">
          <span>Responsible application</span>
          <h2>Decision support&mdash;not employee surveillance.</h2>
          <p>
            The platform should be configured and governed for legitimate
            organisational purposes. It is not intended for secret monitoring,
            individual productivity scoring, employee ranking, automated
            disciplinary decisions or performance judgements without appropriate
            human review.
          </p>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> Define the leadership question
          </p>
          <h2>
            Start with what your
            <br />
            <em>organisation needs to understand.</em>
          </h2>
          <p>Request a demonstration focused on your operational priorities.</p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/platform">
              Explore Platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
