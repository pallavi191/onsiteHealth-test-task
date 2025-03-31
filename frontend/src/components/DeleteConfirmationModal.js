// src/components/DeleteConfirmationModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, patient, onDelete, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the patient <strong>{patient?.name}</strong>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={() => onDelete(patient.id)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
