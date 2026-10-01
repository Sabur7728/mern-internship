import { useState } from "react";

const CandidateForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        location: "",
        skills: "",
        coverLetter: ""
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }));

        // Remove error when user starts correcting the field
        setErrors(previousErrors => ({
            ...previousErrors,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!formData.position) {
            newErrors.position = "Please select a position";
        }

        if (!formData.experience) {
            newErrors.experience = "Experience is required";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        if (!formData.skills.trim()) {
            newErrors.skills = "Skills are required";
        }

        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = "Cover Letter is required";
        }

        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSuccess("");
            return;
        }

        console.log("Candidate Data:", formData);

        setSuccess("Candidate registration submitted successfully!");

        setErrors({});

        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            position: "",
            experience: "",
            location: "",
            skills: "",
            coverLetter: ""
        });
    };

    return (
        <div className="candidate-form">
            <h2>Candidate Registration Form</h2>

            {success && (
                <p className="success">
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <div>
                    <label htmlFor="name">
                        Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />

                    {errors.name && (
                        <p className="error">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />

                    {errors.email && (
                        <p className="error">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone">
                        Phone
                    </label>

                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />

                    {errors.phone && (
                        <p className="error">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Position */}
                <div>
                    <label htmlFor="position">
                        Position
                    </label>

                    <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Position
                        </option>

                        <option value="MERN Developer">
                            MERN Developer
                        </option>

                        <option value="Frontend Developer">
                            Frontend Developer
                        </option>

                        <option value="Backend Developer">
                            Backend Developer
                        </option>

                        <option value="Full Stack Developer">
                            Full Stack Developer
                        </option>
                    </select>

                    {errors.position && (
                        <p className="error">
                            {errors.position}
                        </p>
                    )}
                </div>

                {/* Experience */}
                <div>
                    <label htmlFor="experience">
                        Experience
                    </label>

                    <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Experience
                        </option>

                        <option value="Fresher">
                            Fresher
                        </option>

                        <option value="0-2 Years">
                            0-2 Years
                        </option>

                        <option value="2-5 Years">
                            2-5 Years
                        </option>

                        <option value="5+ Years">
                            5+ Years
                        </option>
                    </select>

                    {errors.experience && (
                        <p className="error">
                            {errors.experience}
                        </p>
                    )}
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location">
                        Location
                    </label>

                    <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                    />

                    {errors.location && (
                        <p className="error">
                            {errors.location}
                        </p>
                    )}
                </div>

                {/* Skills */}
                <div>
                    <label htmlFor="skills">
                        Skills
                    </label>

                    <input
                        id="skills"
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Example: React, Node.js, MongoDB"
                    />

                    {errors.skills && (
                        <p className="error">
                            {errors.skills}
                        </p>
                    )}
                </div>

                {/* Cover Letter */}
                <div>
                    <label htmlFor="coverLetter">
                        Cover Letter
                    </label>

                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Write your cover letter..."
                        rows="5"
                    />

                    {errors.coverLetter && (
                        <p className="error">
                            {errors.coverLetter}
                        </p>
                    )}
                </div>

                <button type="submit">
                    Submit Registration
                </button>

            </form>
        </div>
    );
};

export default CandidateForm;