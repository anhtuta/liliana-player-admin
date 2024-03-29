import React from 'react';
import NormalModal from '../../components/Modal/NormalModal';
import './PictureModal.scss';

const PictureModal = (props) => {
  const { show, pictureUrl, pictureTitle, onClose } = props;

  return (
    <NormalModal
      show={show}
      backdrop={true}
      modalTitle={pictureTitle}
      customClass="show-picture-modal"
      saveButtonText="Okay"
      onSave={onClose}
      onClose={onClose}
    >
      <div>
        <img src={pictureUrl} alt={pictureTitle} />
      </div>
    </NormalModal>
  );
};

export default PictureModal;
