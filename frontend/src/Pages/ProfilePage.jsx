import React, { useState, useEffect } from "react";
import "../Styles/profile.css";
import { Navbar } from "../componets/navbar";
import { Footer } from "../componets/footer";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  // Access authentication store (authUser and checkAuth function)
  const { authUser, checkAuth,updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
    state: authUser?.state || "",
    district: authUser?.district || "",
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth(); // Ensure user authentication check
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load user data.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [checkAuth]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle update click event (for navigation or modal trigger)
  const handleUpdateClick =async () => {
    const res=await updateUser(formData);
    if(res) toast.success("User Updated");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="profile-container loading">
        Loading profile information...
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="maincontainer">
        <div className="profile-container">
          <h1>User Profile</h1>

          <div className="profile-card">
            <div className="profile-field">
              <span className="field-label">Name</span>
              <input
                className="field-value"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <span className="field-label">Email/Phone</span>
              <input
                className="field-value"
                type="text"
                name={formData.email ? "email" : "phone"}
                value={formData.email || formData.phone}
                placeholder="Enter your email or phone"
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <span className="field-label">State</span>
              <span className="field-value">{formData.state}</span>
            </div>

            <div className="profile-field">
              <span className="field-label">District</span>
              <span className="field-value">{formData.district}</span>
            </div>

            <Link
              to={"/update"}
              className="update-Link"
              onClick={handleUpdateClick}
            >
              Update
            </Link>
          </div>
        </div>
      </div>
      <Toaster position="top-center"/>
      <Footer />
    </>
  );
};
export default ProfilePage;