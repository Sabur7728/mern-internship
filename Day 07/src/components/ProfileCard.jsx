const ProfileCard = ({
    name,
    role,
    location,
    experience,
    skills,
    isAvailable
}) => {

    return (
        <div className="profile-card">

            <h2>{name}</h2>

            <p>
                <strong>Role:</strong> {role}
            </p>

            <p>
                <strong>Location:</strong> {location}
            </p>

            <p>
                <strong>Experience:</strong> {experience} years
            </p>

            <h3>Skills:</h3>

            <ul>
                {skills.map((skill) => (
                    <li key={skill}>
                        {skill}
                    </li>
                ))}
            </ul>

            {isAvailable && (
                <p>
                    ✅ Available for Opportunities
                </p>
            )}

        </div>
    );
};

export default ProfileCard;
