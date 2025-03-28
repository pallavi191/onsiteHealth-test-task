const mongoose = require("mongoose");
const { parse } = require("path/posix");

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date,  },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    contactNumber: { type: Number },
    email: { type: String },
    address: { type: String },
    medicalRecordNumber: { type: String, unique: true },
    emergencyContact: { type: Number },
    registerDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

// Generate medicalRecordNumber and save
patientSchema.pre("save", async function (next) {
    if(!this.medicalRecordNumber) {
        try {
            // get last record and based on it increment record number
            const lastPatient = await mongoose.model("Patient").findOne({}, { medicalRecordNumber: 1 }).sort({ medicalRecordNumber: -1 });
            console.log("pre called", lastPatient);

            let newMRN = "MRN-1" //default if no patient exists

            if(lastPatient && lastPatient.medicalRecordNumber) {
                const lastNumber = parse(lastPatient.medicalRecordNumber.split("-")[1], 10);
                console.log(lastNumber, lastPatient);
                newMRN = `MRN-${lastNumber + 1}`;
            }
            console.log("pre called", newMRN);

            this.medicalRecordNumber = newMRN;
        } catch (error) {
            console.log("error: ", error);
            next(error);
        }
            next();
    }
    next();
})

const Patient = mongoose.model("Patient", patientSchema);

async function countAllPatients() {
    return await Patient.countDocuments();
}

async function getPatients(limit, skip) {
    return await Patient.find({})
            .skip(skip)
            .limit(Number(limit));
}

async function getPatientById(patientId) {
    return await Patient.find({ _id:  patientId });
}

async function createPatient(obj) {
    return await new Patient(obj).save();
}

async function updatePatient(patientId, input) {
    return await Patient.updateOne({ _id: patientId }, {
        $set: {
            ...input
        }
    })
}

async function deletePatient(patientId) {
    return await Patient.deleteOne({ _id: patientId })
}

function validateEmail(email) {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^\d{10}$/;
    return regex.test(phone)
}

const PatientsRepo = {
    getPatients,
    countAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    validatePhone,
    validateEmail
}

module.exports.PatientsRepo = PatientsRepo;