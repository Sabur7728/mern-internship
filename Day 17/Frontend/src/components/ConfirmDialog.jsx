export default function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", cancelLabel = "Cancel",
  loading = false, onConfirm, onCancel,
}) {
  if (!open) return null;
  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.box}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button onClick={onConfirm} disabled={loading} style={{ background: "#d33", color: "#fff" }}>
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center", zIndex: 50 },
  box: { background: "#fff", color: "#222", padding: 24, borderRadius: 8, width: 380 },
};