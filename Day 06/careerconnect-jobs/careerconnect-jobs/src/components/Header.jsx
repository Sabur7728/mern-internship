const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                Career<span>Connect</span>
            </div>

            <div className="auth-buttons">
                <button className="login-btn">Login</button>
                <button className="register-btn">Register</button>
            </div>
        </header>
    );
};

export default Header;