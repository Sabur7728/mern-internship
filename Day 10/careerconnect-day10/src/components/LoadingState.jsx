function LoadingState({ message = "Loading..." }) {
  return (
    <div className="loading">
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;