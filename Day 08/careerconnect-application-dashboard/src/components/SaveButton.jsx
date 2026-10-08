const SaveButton = ({
    isSaved,
    onClick
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
        >
            {isSaved ? "Remove Saved" : "Save Job"}
        </button>
    );
};

export default SaveButton;