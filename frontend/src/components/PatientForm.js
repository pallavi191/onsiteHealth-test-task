// src/components/PatientForm.js
import React, { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap';
import { createPatient, updatePatient, getPatientById } from "../services/PatientServices";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const PatientForm = () => {
    const [patient, setPatient] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "Male",
        contactNumber: "",
        email: "",
        address: "",
        emergencyContact: "", // Now it's a simple string/number
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            fetchPatient();
        }
    }, [id]);
    
    const fetchPatient = async () => {
        try {
            const { data } = await getPatientById(id);
            console.log("data: ", data.data[0])
            setPatient(data.data[0]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching patient:", error);
            toast.error("Error fetching patient:")
        }
    };

    const handleChange = (e) => {
        if (e instanceof Date) {
            // Handle DatePicker value (directly gets the date object)
            setPatient((prevPatient) => ({
                ...prevPatient,
                dateOfBirth: e, 
            }));
        } else {
            // Handle normal input fields
            const { name, value } = e.target;
            setPatient((prevPatient) => ({
                ...prevPatient,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const { data } = await updatePatient(id, patient);
                toast.success(data.data.message);
            } else {
                const { data } = await createPatient(patient);
                toast.success(data.data.message);
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving patient:", error);
        }
    };
    return (
        <div className="container my-4">
        <h2>{isEditing ? "Edit" : "Add"} Patient</h2>
        { loading ? <div>Loading...</div> :
            <Form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="d-flex gap-4 flex-md-row flex-column">
                    <Form.Group controlId="firstName" className="mb-3 w-md-50 w-100">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control
                            name="firstName"
                            type="text"
                            placeholder="Enter patient name"
                            value={patient.firstName}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a name.</div>
                    </Form.Group>
                
                    <Form.Group controlId="lastName" className="mb-3 w-md-50 w-100">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control
                            name="lastName"
                            type="text"
                            placeholder="Enter patient name"
                            value={patient.lastName}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Please enter a name.</div>
                    </Form.Group>
                </div>

                <div className="d-flex gap-4 flex-md-row flex-column">
                <Form.Group controlId="email" className="mb-3 w-md-50 w-100">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    name="email"
                    type="text"
                    placeholder="Enter patient name"
                    value={patient.email}
                    onChange={handleChange}
                    required
                />
                <div className="invalid-feedback">Please enter a name.</div>
                </Form.Group>

                <Form.Group controlId="gender" className="mb-3 w-md-50 w-100">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                    name="gender"
                    as="select"
                    value={patient.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option>Other</option>
                </Form.Control>
                <div className="invalid-feedback">Please select a gender.</div>
                </Form.Group>
                </div>

                <div className="d-flex gap-4 flex-md-row flex-column">
                    <Form.Group controlId="contactNumber" className="mb-3 w-md-50 w-100">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                            name="contactNumber"
                            type="tel"
                            value={patient.contactNumber}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        >
                        </Form.Control>
                        <div className="invalid-feedback">Please select a gender.</div>
                    </Form.Group>

                    <Form.Group controlId="emergencyContact" className="mb-3 w-md-50 w-100">
                        <Form.Label>Emergency Contact</Form.Label>
                        <Form.Control
                            name="emergencyContact"
                            type="tel"
                            value={patient.emergencyContact}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        />
                        <div className="invalid-feedback">Please enter a valid emergency contact number.</div>
                    </Form.Group>
                </div>

                <Form.Group controlId="formDob" className="mb-3 w-100 d-flex gap-2 align-items-center">
                    <Form.Label>Date of Birth</Form.Label>
                    <DatePicker
                        name="dateOfBirth"
                        selected={patient.dateOfBirth ? new Date(patient.dateOfBirth) : null}
                        onChange={handleChange} // Update state when a date is selected
                        dateFormat="yyyy/MM/dd" // You can customize the date format
                        className="form-control" // Make the datepicker match the Bootstrap style
                        placeholderText="Select a date"
                    />
                </Form.Group>

                <Button type="submit" className="btn btn-success" disabled={!patient.firstName || !patient.lastName || !patient.dateOfBirth}> {isEditing ? "Update" : "Add"} Patient</Button>

            </Form>
        }
        </div>
    );
};

export default PatientForm;

