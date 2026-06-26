import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import LogTimeline from '../components/LogTimeline';
import caseStudies, { logMeta, schools, internships } from '../data/caseStudies';

// Engineering Log — a grid of work-experience "log entries" (STAR case
// studies). Each card links to its own detail page, mirroring the cache.
const EngineeringLog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="log-page">
      <header className="log-header">
        <section className="rect-container">
          <section className="rect-1"></section>
          <section className="rect-2"></section>
        </section>
        <h1>ENGINEERING LOG</h1>
        <p className="log-prompt-line">
          <span className="log-prompt-sign" aria-hidden="true">root@wound.os ~ %</span>{' '}
          cat /var/log/career
        </p>
        <div className="log-chips log-chips--stack">
          {logMeta.stack.map((tech) => (
            <span key={tech} className="log-chip">{tech}</span>
          ))}
        </div>
      </header>

      <LogTimeline />

      <div className="log-school-head log-work-head" id="exp-salesforce">
        <h3>{logMeta.role}</h3>
        <span>{logMeta.timeline}</span>
      </div>

      <div className="log-section-label log-section-label--sub">
        <p className="log-prompt-line">
          <span className="log-prompt-sign" aria-hidden="true">root@wound.os ~ %</span>{' '}
          cat /var/log/case-studies
        </p>
        <h2>CASE STUDIES</h2>
      </div>

      <section className="log-grid">
        {caseStudies.map((entry, i) => (
          <Reveal as="article" className="log-card" key={entry.id} delay={(i % 2) * 0.08}>
            <Link to={`/log/${entry.id}`} className="log-card-link">
              <div className="log-card-top">
                <span className="log-card-index">
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <span className="log-card-org">{entry.org}</span>
              </div>
              <h2 className="log-card-title">{entry.title}</h2>
              <p className="log-card-period">{entry.period}</p>
              <p className="log-card-summary">{entry.summary}</p>
              <div className="log-chips">
                {entry.stack.slice(0, 4).map((tech) => (
                  <span key={tech} className="log-chip">{tech}</span>
                ))}
                {entry.stack.length > 4 && (
                  <span className="log-chip log-chip--more">+{entry.stack.length - 4}</span>
                )}
              </div>
              <span className="log-card-cta" aria-hidden="true">read entry →</span>
            </Link>
          </Reveal>
        ))}
      </section>

      <div className="log-school" id="exp-careerspring">
        <div className="log-school-head">
          <h3>CareerSpring</h3>
          <span>Internship · 2023</span>
        </div>
        <section className="log-grid log-grid--school">
          {internships.map((p, i) => (
            <Reveal as="article" className="log-card" key={p.id} delay={(i % 2) * 0.08}>
              <Link to={`/cache/${p.cacheId}`} className="log-card-link">
                <div className="log-card-top">
                  <span className="log-card-org">{p.type}</span>
                  <span className="log-card-org">{p.year}</span>
                </div>
                <h2 className="log-card-title">{p.title}</h2>
                <p className="log-card-summary">{p.summary}</p>
                <div className="log-chips">
                  {p.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="log-chip">{tech}</span>
                  ))}
                  {p.stack.length > 4 && (
                    <span className="log-chip log-chip--more">+{p.stack.length - 4}</span>
                  )}
                </div>
                <span className="log-card-cta" aria-hidden="true">view piece →</span>
              </Link>
            </Reveal>
          ))}
        </section>
      </div>

      <section className="log-education">
        <div className="log-section-label">
          <p className="log-prompt-line">
            <span className="log-prompt-sign" aria-hidden="true">root@wound.os ~ %</span>{' '}
            cat /var/log/education
          </p>
          <h2>EDUCATION</h2>
        </div>

        {schools.map((school) => (
          <div className="log-school" id={school.anchor} key={school.name}>
            <div className="log-school-head">
              <h3>{school.name}</h3>
              <span>{school.focus} · {school.period}</span>
            </div>
            <section className="log-grid log-grid--school">
              {school.projects.map((p, i) => (
                <Reveal as="article" className="log-card" key={p.id} delay={(i % 2) * 0.08}>
                  <Link to={`/cache/${p.cacheId}`} className="log-card-link">
                    <div className="log-card-top">
                      <span className="log-card-org">{p.type}</span>
                      <span className="log-card-org">{p.year}</span>
                    </div>
                    <h2 className="log-card-title">{p.title}</h2>
                    <p className="log-card-summary">{p.summary}</p>
                    <div className="log-chips">
                      {p.stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="log-chip">{tech}</span>
                      ))}
                      {p.stack.length > 4 && (
                        <span className="log-chip log-chip--more">+{p.stack.length - 4}</span>
                      )}
                    </div>
                    <span className="log-card-cta" aria-hidden="true">view piece →</span>
                  </Link>
                </Reveal>
              ))}
            </section>
          </div>
        ))}
      </section>
    </div>
  );
};

export default EngineeringLog;
