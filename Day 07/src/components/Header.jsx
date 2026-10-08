import Navigation from "./Navigation";

const Header = () => {
    return (
        <header>
            <div>
                <h1>CareerConnect</h1>
                <p>Build Your Career</p>
            </div>

            <Navigation />

            <div>
                <button>Login</button>
                <button>Register</button>
            </div>
        </header>
    );
};

export default Header;