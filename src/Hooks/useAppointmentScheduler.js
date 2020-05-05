import { useState } from 'react';
import { generateId, reportProblem } from '../Utilities/Tools';
import { REQUESTED } from '../Constants/AppointmentStatusTypes';
import { uploadAppointment } from '../Networking/Firestore';

const useAppointmentScheduler = (name, uid) => {
  const [loading, setLoading] = useState(false);

  const schedule = async({ selectedConsultantUid, selectedConsultant, appointmentUTCDateTime }) => {
    setLoading(true);

    const appointmentId = generateId();

    const user = {uid, name};
    const consultant = {uid: selectedConsultantUid, name: selectedConsultant.name};
    
    const parties = {user, consultant};

    const appointment = {
      ...appointmentUTCDateTime,
      parties,
      price: selectedConsultant.pricePerCall,
      status: REQUESTED,
    };

    try {
      await uploadAppointment(appointmentId, appointment);
    } catch (error) {
      reportProblem(error);
    }

    setLoading(false);
  }

  return [schedule, loading];
};

export default useAppointmentScheduler;