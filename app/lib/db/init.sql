CREATE DATABASE IF NOT EXISTS notable_health;

USE notable_health;

CREATE TABLE IF NOT EXISTS physicians (
    IdPhysician         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    firstName           VARCHAR(255) NOT NULL,
    lastName            VARCHAR(255) NOT NULL,
    PRIMARY KEY (IdPhysician)
);

CREATE TABLE IF NOT EXISTS appointments (
    IdAppointment       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    patientFirstName    VARCHAR(255) NOT NULL,
    patientLastName     VARCHAR(255) NOT NULL,
    date_column         DATE NOT NULL,
    time_column         VARCHAR(8) NOT NULL,
    kind                VARCHAR(24) NOT NULL,
    IdPhysician         BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (IdAppointment),
    FOREIGN KEY (IdPhysician)
    REFERENCES physicians(IdPhysician)
);