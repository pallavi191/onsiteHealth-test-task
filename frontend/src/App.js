// src/App.js
import React, { useState } from 'react';
import NavigationBar from './components/Navbar';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <NavigationBar />
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<PatientList />} />
            <Route path="/add-patient" element={<PatientForm />} />
            <Route path="/edit-patient/:id" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      <ToastContainer />
    </>
  );
}

export default App;
