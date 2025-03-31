// src/components/PatientDetails.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getPatientById } from '../services/PatientServices';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const PatientDetails = () => {
    const { id } = useParams(); // Get patient ID from URL
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchPatientDetails = async () => {
        console.log("id: ", id)
      try {
        const response = await getPatientById(id);
        setPatient(response.data.data[0]);
        console.log("patient: ", response.data.data[0]);   
      } catch (err) {
        // setError("Failed to fetch patient details");
      } finally {
        setLoading(false);
        console.log("loading: ", loading)
      }
    };

    fetchPatientDetails();
  }, [id]);

  return (
    <div className="container mt-4">
        { loading ? <div>Loading...</div> :
            <>
                <h3>Patient Details</h3>
                <p><strong>Firstname:</strong> {patient.firstName}</p>
                <p><strong>Lastname:</strong> {patient.lastName}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <Link to={'/'} className="btn btn-info btn-sm me-2">
                    Back to list
                </Link>
            </>
        }
    </div>
  );
};

export default PatientDetails;
