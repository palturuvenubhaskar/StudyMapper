import { Fragment } from 'react';
import { Check, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import './LinearRoadmap.css';

const STATUS_LABEL = {
  pending: 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
};

const hasChildren = (item) => Array.isArray(item.children) && item.children.length > 0;

const getStatus = (nodeProgress, id) => nodeProgress?.[id] || 'pending';

// Progress for a branch is derived from its leaves. Parent rows are never
// stored as "done" on their own, so the numbers always add up.
const tally = (item, nodeProgress) => {
  if (hasChildren(item)) {
    return item.children.reduce(
      (acc, child) => {
        const next = tally(child, nodeProgress);
        return {
          total: acc.total + next.total,
          done: acc.done + next.done,
          active: acc.active + next.active,
        };
      },
      { total: 0, done: 0, active: 0 },
    );
  }
  if (item.type === 'subgroup' || item.type === 'section') {
    return { total: 0, done: 0, active: 0 };
  }
  const status = getStatus(nodeProgress, item.id);
  return {
    total: 1,
    done: status === 'done' ? 1 : 0,
    active: status === 'in-progress' ? 1 : 0,
  };
};

const aggregateStatus = ({ total, done, active }) => {
  if (total === 0) return 'pending';
  if (done === total) return 'done';
  if (done > 0 || active > 0) return 'in-progress';
  return 'pending';
};

const percentOf = ({ total, done }) => (total > 0 ? Math.round((done / total) * 100) : 0);

function StatusToggle({ status, onToggle, title }) {
  return (
    <button
      type="button"
      className={`lr-check is-${status}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle?.();
      }}
      title={`${title} — ${STATUS_LABEL[status]}`}
      aria-label={`${title}: ${STATUS_LABEL[status]}. Change status.`}
    >
      {status === 'done' && <Check size={13} strokeWidth={3} aria-hidden="true" />}
      {status === 'in-progress' && <span className="lr-check-dot" aria-hidden="true" />}
    </button>
  );
}

function ProgressRing({ counts }) {
  return (
    <span
      className={`lr-ring ${counts.done === counts.total ? 'is-done' : ''}`}
      style={{ '--pct': percentOf(counts) }}
      aria-hidden="true"
    />
  );
}

export default function LinearRoadmap({
  roadmap,
  nodeProgress,
  onNodeClick,
  onLinkClick,
  onToggleStatus,
  nextUpId,
  collapsed,
  onToggleCollapse,
}) {
  const isOpen = (id) => (collapsed[id] === undefined ? true : collapsed[id]);
  const toggleSection = (id) => onToggleCollapse?.(id);

  const renderLink = (item) => item.link && (
    <button
      type="button"
      className="lr-link"
      onClick={(event) => {
        event.stopPropagation();
        onLinkClick?.(item.link.id);
      }}
    >
      <LinkIcon size={12} aria-hidden="true" />
      {item.link.title}
    </button>
  );

  const renderRow = (item) => {
    if (item.type === 'subgroup') {
      return (
        <div key={item.id} className="lr-group">
          <span className="lr-group-label">{item.title}</span>
          {hasChildren(item) && (
            <div className="lr-rows">{item.children.map(renderRow)}</div>
          )}
        </div>
      );
    }

    const kids = hasChildren(item);
    const counts = tally(item, nodeProgress);
    const status = aggregateStatus(counts);
    const isNext = item.id === nextUpId;

    return (
      <Fragment key={item.id}>
        <div
          id={`lr-node-${item.id}`}
          className={`lr-row is-${status} ${isNext ? 'is-next' : ''}`}
        >
          {kids
            ? <ProgressRing counts={counts} />
            : <StatusToggle status={status} title={item.title} onToggle={() => onToggleStatus?.(item)} />}

          <button type="button" className="lr-row-open" onClick={() => onNodeClick?.(item)}>
            <span className="lr-row-title">
              {item.title}
              {isNext && <span className="lr-next">Up next</span>}
              {item.type === 'checkpoint' && <span className="lr-tag">Checkpoint</span>}
            </span>
            {item.description && <span className="lr-row-desc">{item.description}</span>}
          </button>

          {renderLink(item)}
          <ChevronRight className="lr-row-arrow" size={15} aria-hidden="true" />
        </div>

        {kids && <div className="lr-rows">{item.children.map(renderRow)}</div>}
      </Fragment>
    );
  };

  const renderStep = (item) => {
    const kids = hasChildren(item);
    const counts = tally(item, nodeProgress);
    const status = aggregateStatus(counts);
    const isNext = item.id === nextUpId;
    const open = isOpen(item.id);

    return (
      <div
        key={item.id}
        id={`lr-node-${item.id}`}
        className={`lr-step is-${status} ${isNext ? 'is-next' : ''}`}
      >
        <div className="lr-step-main">
          {kids
            ? <span className="lr-ring-wrap"><ProgressRing counts={counts} /></span>
            : <StatusToggle status={status} title={item.title} onToggle={() => onToggleStatus?.(item)} />}

          <button type="button" className="lr-step-open" onClick={() => onNodeClick?.(item)}>
            <span className="lr-step-title">
              {item.title}
              {isNext && <span className="lr-next">Up next</span>}
              {item.type === 'checkpoint' && <span className="lr-tag">Checkpoint</span>}
            </span>
            {item.description && <span className="lr-step-desc">{item.description}</span>}
          </button>

          <span className="lr-step-side">
            {renderLink(item)}
            {kids && <span className="lr-step-count">{counts.done}/{counts.total}</span>}
            {kids && (
              <button
                type="button"
                className={`lr-caret ${open ? 'is-open' : ''}`}
                onClick={() => toggleSection(item.id)}
                aria-expanded={open}
                aria-label={open ? `Collapse ${item.title}` : `Expand ${item.title}`}
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            )}
          </span>
        </div>

        {kids && open && (
          <div className="lr-step-body">
            <div className="lr-rows">{item.children.map(renderRow)}</div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (item, index) => {
    const counts = tally(item, nodeProgress);
    const complete = counts.total > 0 && counts.done === counts.total;
    const open = isOpen(item.id);

    return (
      <section key={item.id} className={`lr-section ${complete ? 'is-complete' : ''}`}>
        <span className="lr-section-marker" aria-hidden="true">
          {complete ? <Check size={14} strokeWidth={3} /> : String(index + 1).padStart(2, '0')}
        </span>

        <button
          type="button"
          className="lr-section-head"
          onClick={() => toggleSection(item.id)}
          aria-expanded={open}
        >
          <span className="lr-section-copy">
            <span className="lr-eyebrow">Section {index + 1}</span>
            <span className="lr-section-title">{item.title}</span>
          </span>

          <span className="lr-section-progress">
            <span className="lr-section-count">{counts.done}/{counts.total}</span>
            <span className="lr-section-track" aria-hidden="true">
              <span style={{ width: `${percentOf(counts)}%` }} />
            </span>
          </span>

          <ChevronDown
            className={`lr-section-caret ${open ? 'is-open' : ''}`}
            size={18}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="lr-section-body">
            {item.children.map(child => (child.type === 'section' ? renderSection(child, index) : renderStep(child)))}
          </div>
        )}
      </section>
    );
  };

  let sectionIndex = 0;

  return (
    <div className="lr-container">
      {(roadmap.items || []).map(item => (
        item.type === 'section'
          ? renderSection(item, sectionIndex++)
          : renderStep(item)
      ))}
    </div>
  );
}
