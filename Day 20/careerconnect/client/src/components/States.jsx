export const Loading = ({ text = 'Loading...' }) => (
  <div className="center-state"><div className="spinner" /><p>{text}</p></div>
);
export const ErrorBox = ({ message, onRetry }) => (
  <div className="alert error">
    <span>{message}</span>
    {onRetry && <button className="btn small" onClick={onRetry}>Retry</button>}
  </div>
);
export const Empty = ({ text = 'No records found.' }) => <div className="center-state muted">{text}</div>;

// Renders loading / error / empty / content for a useFetch result
export function Async({ state, isEmpty, emptyText, children }) {
  if (state.loading) return <Loading />;
  if (state.error) return <ErrorBox message={state.error} onRetry={state.reload} />;
  if (isEmpty) return <Empty text={emptyText} />;
  return children;
}
