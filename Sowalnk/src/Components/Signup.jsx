import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = 'Invalid phone number (10 digits required)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:3001/add-user', formData);
        alert('User registered successfully!');
        navigate('/login');
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Error registering user');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h2 className="mb-6 text-2xl font-bold text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <User className="absolute mt-2 ml-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <Mail className="absolute mt-2 ml-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <Lock className="absolute mt-2 ml-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div>
            <Lock className="absolute mt-2 ml-2" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>
          <div>
            <Phone className="absolute mt-2 ml-2" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
