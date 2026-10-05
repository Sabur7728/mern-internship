function Register() {
  return (
    <div className="page">
      <h1>Register</h1>

      <form className="form">
        <label>Name</label>

        <input
          type="text"
          placeholder="Enter name"
        />

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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;