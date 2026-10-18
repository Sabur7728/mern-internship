export function Loading() { return <p className="state">Loading…</p>; }
export function ErrorMsg({ message, retry }) { return <p className="state bad">{message} {retry && <button className="btn ghost" onClick={retry}>Try again</button>}</p>; }
export function Empty({ children }) { return <p className="state">{children}</p>; }
