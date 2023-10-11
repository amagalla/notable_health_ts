import db from "../db/mysql.config"
import { AllPhysiciansRequest, NewAppointRequest } from "../interfaces/appointments.interface";

const getPhysicianList = async () => {
    const getQuery = "SELECT * FROM physicians";

    let resp: any;

    try {
        resp = await db.query(getQuery);
    } catch (err) {
        return {
            err: err,
        };
    }

    return resp[0];
}

 const getAppointments = async (IdPhysician: number, date_column: string) => {

    let resp: any;

    const
        formattedDate = dateSplit(date_column),
        getQuery = 'SELECT * FROM appointments '
        + 'WHERE IdPhysician = ? AND date_column = ?';

    try {
        resp = await db.query(getQuery, [IdPhysician, formattedDate]);
    } catch (err) {
        return {
            error: err,
        }
    }

    return resp[0];
 }

const postPhysician = async(physician: AllPhysiciansRequest) => {

    const {firstName, lastName} = physician;

    const
        checkQuery = "SELECT firstName, lastName FROM physicians WHERE firstName = (?) AND lastName = (?)",
        insertQuery = 'INSERT INTO physicians (firstName, lastName) '
    + 'VALUES (?, ?)';

    let resp: any;

    try {
        resp = await db.query(checkQuery, [firstName, lastName]);
    } catch(err) {
        return {
            error: err,
        };
    }

    if (resp[0].length > 0) {
        return {
            error: 'Physician already exists',
        };
    }

    try {
        await db.query(insertQuery, [firstName, lastName]);
    } catch (err) {
        return {
            error: err,
        };
    };

    return {
        success: `${firstName} ${lastName} registered`,
    }

}

const checkAvailability = async (date: string, time: string, IdPhysician: number) => {

    let resp: any;

    const
        formattedDate = dateSplit(date),
        getQuery = 'SELECT * FROM appointments '
        + 'WHERE date_column = ? AND time_column = ? AND IdPhysician = ?';

    try {
        console.log('About to query for avail')
        resp = await db.query(getQuery, [formattedDate, time, IdPhysician]);
    } catch (err) {
        return {
            error: err,
        }
    }

    if (resp[0].length > 2) {
        
        return {
            error: "Too many appointments with this physician at this time",
        }
    }

    return ;
}

const postAppointment = async (app: NewAppointRequest, IdPhysician: number) => {

    const {
        patientFirstName,
        patientLastName,
        date_column,
        time_column,
        kind,
    } = app;

    const formattedDate = dateSplit(date_column);

    const insertQuery = 'INSERT INTO appointments '
    + '(patientFirstName, patientLastName, date_column, time_column, kind, IdPhysician) '
    + 'VALUE (?, ?, ?, ?, ?, ?)';

    try {
        db.query(insertQuery, [
            patientFirstName,
            patientLastName,
            formattedDate,
            time_column,
            kind,
            IdPhysician
        ]);
    } catch (err) {
        return {
            error: err,
        }
    }

    return {
        success: `${patientFirstName}'s appointment has been created`
    }
}

const deleteAppointment = async (IdAppointment: number, IdPhysician: Number) => {
    const deleteQuery = 'DELETE FROM appointments WHERE IdAppointment = ? AND IdPhysician = ?';

    try {
        db.query(deleteQuery, [IdAppointment, IdPhysician]);
    } catch(err) {
        return {
            error: err,
        }
    }

    return {
        success: 'Appointment canceled successfully'
    }
}

export {
    getPhysicianList,
    getAppointments,
    postPhysician,
    checkAvailability,
    postAppointment,
    deleteAppointment,
}

const dateSplit = (date: string): string => {
    const dateParts = date.split('/');
        
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}