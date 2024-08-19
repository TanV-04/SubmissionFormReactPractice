import React, { useState } from "react";
import axios from "axios";

export const Inputs = () => {
  const [isChecked, setIsChecked] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});

  function checkBox() {
    setIsChecked((prevState) => !prevState);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Clear previous errors
    setErrors({});
    const errors = {};

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email.";
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    // Country validation
    if (!country) {
      errors.country = "Please select a country.";
    }

    // Checkbox validation
    if (!isChecked) {
      errors.isChecked = "You must accept the terms of service.";
    }

    // If there are errors, set them in the state and return
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/validate", {
        email,
        password,
      });

      if (response.data.valid) {
        const formData = { email, password, country, isChecked };
        localStorage.setItem("formData", JSON.stringify(formData)); // store data in localStorage
        alert("form submitted successfully");
      } else {
        setErrors({ ...errors, form: response.data.message });
        alert(response.data.message); // show server error message
      }
    } catch (error) {
      setErrors({
        ...errors,
        form: "an error has occured while submitting the form",
      });
      alert("incorrect username or password. try again.");
    }

    // If no errors, save form data
    const formData = { email, password, country, isChecked };

    localStorage.setItem("formData", JSON.stringify(formData));

    // Retrieve and log the stored data
    const storedData = JSON.parse(localStorage.getItem("formData"));
    console.log("Stored Data:", storedData);

    // Optionally, you can show a success message
    // alert("Form submitted successfully!");
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-gray-700 text-left"
            htmlFor="emailInput"
          >
            Email
          </label>
          <input
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : ""
            }`}
            name="emailInput"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-gray-700 text-left"
            htmlFor="passwordInput"
          >
            Password
          </label>
          <input
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : ""
            }`}
            name="passwordInput"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* conditionally render an error message for a password field in a form */}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )} 
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-gray-700 text-left"
            htmlFor="countryInput"
          >
            Country
          </label>
          <select
            onChange={(e) => setCountry(e.target.value)}
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.country ? "border-red-500" : ""
            }`}
          >
            <option value="">Select your country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="gb">United Kingdom</option>
            <option value="au">Australia</option>
            <option value="in">India</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="checkBox"
            name="checkBox"
            type="checkbox"
            checked={isChecked}
            onChange={checkBox}
            className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700" htmlFor="checkBox">
            I accept the terms of service
          </label>
          {errors.isChecked && (
            <p className="text-red-500 text-sm">{errors.isChecked}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// 401 Unauthorized indicates that the credentials don't match any records in the MySQL database
