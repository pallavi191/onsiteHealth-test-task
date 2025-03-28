const express = require("express");
const router = express.Router();

// import models
const { PatientsRepo } = require("../models/patients")

// import middlewares
const routeHandler = require("../middleware/routeHandler");

router.get("/hello", (req, res) => {
    res.send({message: "Welcome to Patients API"});
})

// Retrieve all patients - with pagination
router.get("/", (req, res) => {
    routeHandler.invoke(res, async () => {
        const page = parseInt(req.query.page) || 1; //default page 1, if not provided
        const limit = parseInt(req.query.limit) || 10 //default limit 10
        const skip = (page - 1) * limit;

        const patients = await PatientsRepo.getPatients(skip, limit);
        const totalPatients =  await PatientsRepo.countAllPatients();

        return {
            patients,
            totalPatients,
            currentPage: page
        }
    })
})

// Retrieve specific patient - based on id
router.get("/:patientId", (req, res) => {
    routeHandler.invoke(res, async () => {
        return await PatientsRepo.getPatientById(req.params.patientId);
    })
})

// Create a new patient
router.post("/", (req, res, next) => {
    routeHandler.invoke(res, async () => {
        const { firstName, lastName, dateOfBirth, 
            gender, contactNumber, email, address,
            medicalRecordNumber, emergencyContact 
          } = req.body;

        if(!firstName || !lastName)// || !dateOfBirth)
            throw new Error("All fields are required!");

        if(email) {
            const isValid = PatientsRepo.validateEmail(email);
            if(!isValid) throw new Error("Email is not valid!");
        }


        if(contactNumber) {
            const isValid = PatientsRepo.validatePhone(contactNumber);
            if(!isValid) throw new Error("Contact number is not valid!");
        }

        if(emergencyContact) {
            const isValid = PatientsRepo.validatePhone(emergencyContact);
            if(!isValid) throw new Error("Emergency contact number is not valid!");
        }
    
        const newObj = {
            firstName,
            lastName,
            dateOfBirth, 
            gender,
            contactNumber,
            email,
            address,
            medicalRecordNumber,
            emergencyContact 
        }

        const patient = await PatientsRepo.createPatient(newObj);

        if(patient) {
            return {
                patient,
                message: "Patient added succefully!"
            }
        }
    })
})

// update a existing patient
router.put("/:patientId", (req, res, next) => {
    routeHandler.invoke(res, async () => {
        const patientId = req.params.patientId;

        const { firstName, lastName, dateOfBirth, 
            gender, contactNumber, email, address,
            medicalRecordNumber, emergencyContact 
          } = req.body;

        if(email) {
            const isValid = PatientsRepo.validateEmail(email);
            if(!isValid) throw new Error("Email is not valid!");
        }

        if(contactNumber) {
            const isValid = PatientsRepo.validatePhone(contactNumber);
            if(!isValid) throw new Error("Contact number is not valid!");
        }

        if(emergencyContact) {
            const isValid = PatientsRepo.validatePhone(emergencyContact);
            if(!isValid) throw new Error("Emergency contact number is not valid!");
        }
    
        const newObj = {
            firstName,
            lastName,
            dateOfBirth, 
            gender,
            contactNumber,
            email,
            address,
            medicalRecordNumber,
            emergencyContact 
        }

        const updated = await PatientsRepo.updatePatient(patientId, newObj);
        console.log("update: ", updated)
        if(updated.modifiedCount > 0) {
            return {
                message: "Patient details updated successfully!"
            }
        }
    })
})

// delete an existing patient
router.delete("/:patientId", (req, res, next) => {
    routeHandler.invoke(res, async () => {
        const patientId = req.params.patientId;

        const deleted = await PatientsRepo.deletePatient(patientId);
        console.log("update: ", deleted)
        if(deleted.deletedCount > 0) {
            return {
                message: "Patient removed successfully!"
            }
        }
    })
})

module.exports = router;