function Login() {
  return (
    <div className="page">
      <h1>Login</h1>

      <form className="form">
        <label>Email</label>

        <input
          type="email"
          placeholder="Enter email"
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter password"
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;