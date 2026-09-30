const Button = ({
    label,
    variant = "primary",
    disabled = false
}) => {
    return (
        <button
            className={`button ${variant}`}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;