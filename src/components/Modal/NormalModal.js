import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';

const NormalModal = (props) => {
  const {
    show,
    customClass = '',
    size = '',
    modalTitle = '',
    saveButtonText = '',
    cancelButtonText = '',
    onSave,
    onCancel,
    onClose,
    children,
    isDelete = false,
    disabledSaveBtn = false,
    buttons
  } = props;

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      centered={true}
      dialogClassName={`custom-modal-wrapper ${size} ${customClass}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {saveButtonText && (
          <Button
            type={isDelete ? 'delete-button' : 'solid-button'}
            className={isDelete ? 'btn-danger' : 'btn-success'}
            onClick={onSave}
            text={saveButtonText}
            disabled={disabledSaveBtn}
          />
        )}
        {cancelButtonText && (
          <Button
            type="clear-button"
            className="btn-secondary"
            onClick={onCancel}
            text={cancelButtonText}
          />
        )}
        {buttons &&
          buttons.map((button) => {
            return (
              <Button
                key={button.key}
                type={button.type}
                onClick={button.onClick}
                text={button.text}
                disabled={button.disabled}
              />
            );
          })}
      </Modal.Footer>
    </Modal>
  );
};

export default NormalModal;
