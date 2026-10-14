export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p role="alert" style={{ color: "#b00020", padding: "0.5rem 0" }}>
      {message}
    </p>
  );
}