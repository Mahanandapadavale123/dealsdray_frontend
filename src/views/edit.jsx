import React, { useEffect, useState } from "react";
import Header from "./layout/header";
import "../css/create.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  console.log(id);
  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const designations = ["Manager", "Sales", "HR"];
  const courses = ["MCA", "BCA", "BSC"];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/employees/${id}`, {
          withCredentials: true,
        });

        console.log(response);
        
        if (response.data.status === true && response.data.employee) {
          const employeeData = response.data.employee;
          setFormData({
            name: employeeData.name,
            email: employeeData.email,
            mobile: employeeData.mobileNo,
            designation: employeeData.designation,
            gender: employeeData.gender,
            courses: employeeData.courses || [],
            image: null, 
          });
        } else {
          alert("Employee not found");
        }
      } catch (err) {
        console.log(err);
        
        alert("Error fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    const updatedCourses = formData.courses.includes(selectedCourse)
      ? formData.courses.filter((course) => course !== selectedCourse)
      : [...formData.courses, selectedCourse];
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNo", formData.mobile);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("gender", formData.gender);
      formData.courses.forEach((course) => formDataToSend.append("courses[]", course));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/v1/employees/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === true) {
        alert(response.data.message);
        navigate("/employees");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      let data = err.response?.data;
      alert(data?.message || "Error updating employee");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Header />

      <div className="row breadcrump">
        <span>Edit Employee</span>
      </div>

      <main className="content">
        <div className="container form-div">
          <div className="card">
            <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
              <div className="formGroup">
                <label className="label">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="formGroup">
                <label className="label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="formGroup">
                <label className="label">Mobile Number:</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="formGroup">
                <label className="label">Designation:</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label className="label">Gender:</label>
                <div className="inlineGroup">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleGenderChange}
                    />{" "}
                    Male
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleGenderChange}
                    />{" "}
                    Female
                  </label>
                </div>
              </div>

              <div className="formGroup">
                <label className="label">Courses:</label>
                <div className="inlineGroup">
                  {courses.map((course) => (
                    <label key={course} style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        value={course}
                        checked={formData.courses.includes(course)}
                        onChange={handleCourseChange}
                      />{" "}
                      {course}
                    </label>
                  ))}
                </div>
              </div>

              <div className="formGroup">
                <label className="label">Img Upload:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="input"
                />
              </div>

              <button type="submit" className="button">
                {isLoading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditEmployee;
