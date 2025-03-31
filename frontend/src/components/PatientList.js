// src/components/PatientList.js
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { getPatients, deletePatient } from "../services/PatientServices";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state (default 5)

  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search query
  // const filteredPatients = patients.filter((patient) =>
  //   `${patient.firstName} ${patient.lastName} ${patient.medicalRecordNumber}`
  //     .toLowerCase()
  //     .includes(search.toLowerCase())
  // );
  useEffect(() => {
    fetchPatients(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]); // 🔥 Runs when `currentPage` OR `itemsPerPage` changes
  

  const fetchPatients = async (currentPage, itemsPerPage) => {
    console.log("itemsPerPage: ", itemsPerPage)

    try {
      const response = await getPatients(currentPage, itemsPerPage);
      setPatients(response.data.data.patients);
      setCurrentPage(response.data.data.currentPage);
      setTotalPages(response.data.data.totalPatients);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };
  const handleDelete = async () => {
    console.log("Delete patient with id: ", patientToDelete);
    try {
        const { data } = await deletePatient(patientToDelete);
        fetchPatients();
        toast.success(data.data.message);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
  
      setShowDeleteModal(false); // Close the delete confirmation modal
  };
  const handleOpenDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null); // Reset the patient to be deleted
  };
  const handleSearch = event => setSearchQuery(event.target.value);
  const handlePageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update itemsPerPage
    setCurrentPage(1); // Reset to first page
    console.log("itemsPerPage: ", itemsPerPage, event.target.value)
  };
  return (
    <div className="container my-4">
      <div>
        <h2>Patient List</h2>
        <Form.Control
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-3 w-50"
        />
      </div>
      <div className="overflow-auto">
      { patients && patients.length > 0 ? (
      <Table striped bordered hover className="overflow-auto">
        <thead>
          <tr>
            <th>No</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Medical Record No</th>
            <th>Emergency Contact</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render patients */}
          {patients.map((patient, index) => (
            <tr key={patient._id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{patient.email}</td>
              <td>{patient.gender}</td>
              <td>{patient.contactNumber}</td>
              <td>{patient.address}</td>
              <td>{patient.medicalRecordNumber}</td>
              <td>{patient.emergencyContact}</td>
              <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                    <Link to={`/patients/${patient._id}`} className="btn btn-info btn-sm">
                        <i className="bi bi-eye"></i>
                    </Link>
                    <Link to={`/edit-patient/${patient._id}`} className="btn btn-primary btn-sm" variant="warning" size="sm">
                    <i className="bi bi-pencil"></i>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(patient._id)}>
                    <i className="bi bi-trash"></i>
                    </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      ) : (
        <p className="text-center text-muted">No patients found</p>
      )}
    </div>
    {
        patients && patients.length > 0 && (
          <div className="d-flex justify-content-between w-100">
          <div className="w-md-auto w-70" style={{ width: '60%' }}>
          <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
          </Pagination>
          </div>
          <div className="w-md-auto w-30" style={{ width: '20%' }}>
            <Form.Group controlId="itemsPerPage" className="mb-3 d-flex gap-2 align-items-center">
              <Form.Label style={{ width: '60%' }}>Items per page</Form.Label>
              <Form.Control style={{ width: '40%' }}
                as="select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Form.Control>
            </Form.Group>
          </div>
          </div>    
        )
      }
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
          show={showDeleteModal}
          patient={patientToDelete}
          onDelete={handleDelete}
          onCancel={handleCloseDeleteModal}
       />
    </div>
  );
};

export default PatientList;
