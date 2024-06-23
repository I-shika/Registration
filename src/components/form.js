import React, { useState, useEffect } from 'react';
import './form.css';

// Custom hook for form handling
const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name.startsWith('additionalSkills.')) {
      const skill = name.split('.')[1];
      setValues({
        ...values,
        additionalSkills: {
          ...values.additionalSkills,
          [skill]: newValue,
        },
      });
    } else {
      setValues({
        ...values,
        [name]: newValue,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0) {
      alert(`Form submitted successfully!\n${JSON.stringify(values, null, 2)}`);
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, values]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

// Validation function
const validate = (values) => {
  let errors = {};
  if (!values.fullName) errors.fullName = 'Full Name is required';
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Phone Number is required';
  } else if (!/^\d{10}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Please enter 10 digits number.';
  }
  if ((values.position === 'Developer' || values.position === 'Designer') && (!values.relevantExperience || values.relevantExperience <= 0)) {
    errors.relevantExperience = 'Relevant Experience is required and must be greater than 0';
  }
  if (values.position === 'Designer' && (!values.portfolioURL || !/^https?:\/\/.*\..*/i.test(values.portfolioURL))) {
    errors.portfolioURL = 'Portfolio URL is required and must be a valid URL';
  }
  if (values.position === 'Manager' && !values.managementExperience) {
    errors.managementExperience = 'Management Experience is required';
  }
  if (!values.additionalSkills || Object.values(values.additionalSkills).every(skill => !skill)) {
    errors.additionalSkills = 'At least one skill must be selected';
  }
  if (!values.preferredInterviewTime) {
    errors.preferredInterviewTime = 'Preferred Interview Time is required';
  }
  return errors;
};

const EventRegistrationForm = () => {
  const initialValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
    position: '',
    relevantExperience: '',
    portfolioURL: '',
    managementExperience: '',
    additionalSkills: {
      JavaScript: false,
      CSS: false,
      Python: false,
    },
    preferredInterviewTime: '',
  };

  const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validate);

  return (
    <div className="container">
      <h2>Job Application Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>
        <div>
          <label>Applying for Position:</label>
          <select name="position" value={values.position} onChange={handleChange}>
            <option value="">Select a position</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        {(values.position === 'Developer' || values.position === 'Designer') && (
          <div>
            <label>Relevant Experience (years):</label>
            <input
              type="number"
              name="relevantExperience"
              value={values.relevantExperience}
              onChange={handleChange}
            />
            {errors.relevantExperience && <p className="error">{errors.relevantExperience}</p>}
          </div>
        )}
        {values.position === 'Designer' && (
          <div>
            <label>Portfolio URL:</label>
            <input
              type="text"
              name="portfolioURL"
              value={values.portfolioURL}
              onChange={handleChange}
            />
            {errors.portfolioURL && <p className="error">{errors.portfolioURL}</p>}
          </div>
        )}
        {values.position === 'Manager' && (
          <div>
            <label>Management Experience:</label>
            <input
              type="text"
              name="managementExperience"
              value={values.managementExperience}
              onChange={handleChange}
            />
            {errors.managementExperience && <p className="error">{errors.managementExperience}</p>}
          </div>
        )}
        <div>
          <label>Additional Skills:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="additionalSkills.JavaScript"
                checked={values.additionalSkills.JavaScript}
                onChange={handleChange}
              />
              JavaScript
            </label>
            <label>
              <input
                type="checkbox"
                name="additionalSkills.CSS"
                checked={values.additionalSkills.CSS}
                onChange={handleChange}
              />
              CSS
            </label>
            <label>
              <input
                type="checkbox"
                name="additionalSkills.Python"
                checked={values.additionalSkills.Python}
                onChange={handleChange}
              />
              Python
            </label>
          </div>
          {errors.additionalSkills && <p className="error">{errors.additionalSkills}</p>}
        </div>
        <div>
          <label>Preferred Interview Time:</label>
          <input
            type="datetime-local"
            name="preferredInterviewTime"
            value={values.preferredInterviewTime}
            onChange={handleChange}
          />
          {errors.preferredInterviewTime && <p className="error">{errors.preferredInterviewTime}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventRegistrationForm;
