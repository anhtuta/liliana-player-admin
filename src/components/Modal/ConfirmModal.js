import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';

const ConfirmModal = (props) => {
  const {
    show,
    customClass = '',
    modalTitle = '',
    bodyMessage = '',
    cancelButtonText = '',
    saveButtonText = '',
    onClose,
    onCancel,
    onSave,
    isDelete = false,
    children
  } = props;

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      centered={true}
      dialogClassName={`custom-modal-wrapper ${customClass}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      {(bodyMessage || children) && (
        <Modal.Body>
          {bodyMessage}
          {children}
        </Modal.Body>
      )}
      <Modal.Footer>
        {saveButtonText && (
          <Button
            type={isDelete ? 'delete-button' : 'solid-button'}
            className={isDelete ? 'btn-danger' : 'btn-success'}
            onClick={onSave}
            text={saveButtonText}
          />
        )}
        {cancelButtonText && (
          <Button
            type="clear-button"
            onClick={onCancel}
            text={cancelButtonText}
            className="btn-secondary"
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
