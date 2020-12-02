import React from 'react';
import { Modal, SuccessDisplay } from '../../../../components/UIComponents'
import CreateAppointmentTime from './CreateAppointmentTime';
import CreateOwnerProfile from './CreateOwnerProfile';
import SelectAppointmentTime from './SelectAppointmentTime';

function RequestBookingModal({
  t,
  modalVisible,
  closeModal,
  profileActionStatus,
}) {
  const renderModalContent = () => {
    switch (profileActionStatus) {
      case 'APPOINTMENT_TIME_NOT_FOUND':
        return <CreateAppointmentTime t={t} modalVisible={modalVisible} />
      case 'OWNER_PROFILE_NOT_FOUND':
        return <CreateOwnerProfile t={t} />
      case 'BOOKING_REQUEST_SENT':
        return <SuccessDisplay message="You have successfully sent your booking request." onClick={closeModal} />
      default:
        return <SelectAppointmentTime t={t} />
    }
  }

  return (
    <Modal
      visible={modalVisible}
      onCancel={closeModal}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
      footer={null}
      maskClosable={false}
      style={{ width: 700 }}
    >
      {renderModalContent()}
    </Modal>
  );
}

export default RequestBookingModal;