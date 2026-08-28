import { Link } from 'react-router-dom';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  actionOnClick,
  secondaryLabel,
  secondaryHref,
  secondaryOnClick
}) {
  return (
    <div className="empty-state">
      {Icon && <Icon className="empty-state-icon" size={48} strokeWidth={1.5} />}
      <h3>{title}</h3>
      <p>{description}</p>

      {(actionLabel || secondaryLabel) && (
        <div className="empty-state-actions">
          {actionLabel && (
            actionHref ? (
              <Link to={actionHref} className="btn btn-primary">
                {actionLabel}
              </Link>
            ) : (
              <button onClick={actionOnClick} className="btn btn-primary">
                {actionLabel}
              </button>
            )
          )}
          {secondaryLabel && (
            secondaryHref ? (
              <Link to={secondaryHref} className="btn btn-secondary">
                {secondaryLabel}
              </Link>
            ) : (
              <button onClick={secondaryOnClick} className="btn btn-secondary">
                {secondaryLabel}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
