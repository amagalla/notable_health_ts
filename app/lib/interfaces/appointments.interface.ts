export interface AllPhysiciansRequest {
    firstName: string;
    lastName: string;
}

export interface NewAppointRequest {
    patientFirstName: string;
    patientLastName: string;
    date_column: string;
    time_column: string;
    kind: string;
}