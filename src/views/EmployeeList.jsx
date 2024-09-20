import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/employee.css";
import Header from "./layout/header";

const EmployeeList = () => {
  const [employee, setEmployee] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateEmployee = () => {
    navigate("/employees/create"); 
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/employees", {
        withCredentials: true,
      });

      if (response.data.status === true && Array.isArray(response.data.employees)) {
        setEmployee(response.data.employees);
        setTotalCount(response.data.employees.length);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      console.log(err);
      setError("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/v1/employees/${id}`, {
          withCredentials: true
        })
        .then((response) => {
          console.log("Employee deleted:", response.data);
          if(response.data.status === true)  {
            alert(response.data.message)
            fetchEmployees();
          }else{
            alert(response.data.message)
          }
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          alert(error.response.message)
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="page-container">
      <Header />

      <main className="content">
        <div className="container">
          <div className="row">
            <div className="page-heading-name">
              
              <span>Employee List</span>
              <div className="row">
                <span>Total Count : { totalCount }</span>
                &nbsp;&nbsp;
                <button
                  className="create-button"
                  onClick={handleCreateEmployee}
                >
                  {" "}
                  Create Employee{" "}
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Designation</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th>Create Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {employee.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center">No employees found</td>
                  </tr>
                ) : (
                employee.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={ 'public/uploads/'+ employee.image} alt={employee.name} />
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.mobileNo}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.courses?.map((course, index) => (
                      <span key={index}>
                        {course}{index < employee.courses.length - 1 && ", "}
                      </span>
                    ))}</td>
                    <td>
                      {new Date(employee.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(employee._id)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))

              )}

              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;
