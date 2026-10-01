const Header = ({ savedCount }) => {
    return (
        <header className="header">
            <div className="logo">
                Career<span>Connect</span>
            </div>

            <nav>
                <a href="#jobs">Jobs</a>
                <a href="#saved">
                    Saved Jobs ({savedCount})
                </a>
            </nav>
        </header>
    );
};

export default Header;