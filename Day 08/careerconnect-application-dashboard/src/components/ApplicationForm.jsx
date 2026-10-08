import { useState } from "react";

const ApplicationForm = ({
    selectedJob,
    onClose,
    onSubmit
}) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        location: "",
        resume: "",
        coverLetter: ""
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }));

        // Remove error while typing
        setErrors(previousErrors => ({
            ...previousErrors,
            [name]: ""
        }));
    };


    // Validate form
    const validateForm = () => {

        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            newErrors.email = "Please enter a valid email";
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        // Experience validation
        if (!formData.experience) {
            newErrors.experience =
                "Experience is required";
        }

        // Cover Letter validation
        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter =
                "Cover letter is required";
        }

        return newErrors;
    };


    // Submit form
    const handleSubmit = (event) => {

        event.preventDefault();

        const validationErrors = validateForm();

        // If errors exist
        if (Object.keys(validationErrors).length > 0) {

            setErrors(validationErrors);

            return;
        }

        // Send form data to parent
        onSubmit(formData);

        // Clear form
        setFormData({
            name: "",
            email: "",
            phone: "",
            experience: "",
            location: "",
            resume: "",
            coverLetter: ""
        });

        setErrors({});
    };


    return (
        <div className="application-container">

            {/* Selected Job */}

            <div className="application-header">

                <div>

                    <p>Applying for:</p>

                    <h2>
                        {selectedJob.title}
                    </h2>

                    <p>
                        Company: {selectedJob.company}
                    </p>

                </div>

                <button
                    type="button"
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

            </div>


            {/* Application Form */}

            <form onSubmit={handleSubmit}>

                {/* Name */}

                <div className="form-group">

                    <label htmlFor="name">
                        Full Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
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

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
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

                <div className="form-group">

                    <label htmlFor="phone">
                        Phone
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
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


                {/* Experience */}

                <div className="form-group">

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


                {/* Current Location */}

                <div className="form-group">

                    <label htmlFor="location">
                        Current Location
                    </label>

                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter your current location"
                    />

                </div>


                {/* Resume */}

                <div className="form-group">

                    <label htmlFor="resume">
                        Resume Filename
                    </label>

                    <input
                        id="resume"
                        name="resume"
                        type="text"
                        value={formData.resume}
                        onChange={handleChange}
                        placeholder="Example: Resume.pdf"
                    />

                </div>


                {/* Cover Letter */}

                <div className="form-group">

                    <label htmlFor="coverLetter">
                        Cover Letter
                    </label>

                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Write your cover letter..."
                        rows="6"
                    />

                    {errors.coverLetter && (
                        <p className="error">
                            {errors.coverLetter}
                        </p>
                    )}

                </div>


                {/* Buttons */}

                <div className="form-actions">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button type="submit">
                        Submit Application
                    </button>

                </div>

            </form>

        </div>
    );
};

export default ApplicationForm;