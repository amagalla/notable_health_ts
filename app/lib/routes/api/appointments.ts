import express, { Request, Response, NextFunction } from 'express'
import { checkAvailability, deleteAppointment, getAppointments, getPhysicianList, postAppointment, postPhysician } from '../../controller/appointments';
import { AllPhysiciansRequest, NewAppointRequest } from '../../interfaces/appointments.interface';
import { checkTime } from '../../middleware/timeCheck';

const router = express.Router();

/**
 * @swagger
 * 
 * definitions:
 *  InsertPhysicians:
 *      type: object
 *      description: Physician Information
 *      properties:
 *          firstName:
 *              type: string
 *              example: Ai
 *          lastName:
 *              type: string
 *              example: Hoshino
 *  AddAppointment:
 *      type: object
 *      description: Add an Appointment
 *      properties:
 *          patientFirstName:
 *              type: string
 *              example: Lucy
 *          patientLastName:
 *              type: string
 *              example: Kushinada
 *          date_column:
 *              type: string
 *              example: 10/11/2023
 *          time_column:
 *              type: string
 *              example: 8:00AM
 *          kind:
 *              type: string
 *              example: New Patient
 */

/**
 * @swagger

 * /api/appointments/allPhysicians:
 *  get:
 *     description: Get a list of all physicians
 *     responses:
 *       200:
 *         description: Successful Response
 *       500:
 *          description: Failed to receive list of physicians
 */

router.get(
    "/allPhysicians",
    async (req: Request, res: Response, next: NextFunction) => {
        let resp;

        try {
            resp = await getPhysicianList();
        } catch (err: any) {
            return next(new Error(err))
        }

        res.status(200).send(resp);
    },
);

/**
 * @swagger
 * 
 * /api/appointments/appointmentLookup:
 *  get:
 *      description: Get a list of physician's appoinmtents on a specific day
 *      parameters:
 *          - in: query
 *            name: IdPhysician
 *            required: true
 *            type: integer
 *            example: 1
 *            description: Id of physician
 *          - in: query
 *            name: date_column
 *            required: true
 *            type: string
 *            example: 10/11/2023
 *            description: Date of appointments
 *      responses:
 *          200:
 *              description: Retrieved appointments successfully
 *          400:
 *              description: Failed to get appointments    
 */

router.get(
    "/appointmentLookup",
    async (req: Request, res: Response, next: NextFunction) => {
        const { IdPhysician, date_column } = req.query;

        let resp: any;

        try {
            resp = await getAppointments(Number(IdPhysician), String(date_column))
        } catch (err: any) {
            return next(new Error(err))
        }

        res.status(200).send(resp)
    },
);

/**
 * @swagger
 * 
 * /api/appointments/insertPhysicians:
 *  post:
 *    description: Register a new physician
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: Insert new Physician
 *        required: true
 *        schema:
 *          $ref: '#/definitions/InsertPhysicians'
 *    responses:
 *      200:
 *          description: Physician registered successfully
 *      400:
 *          description: Registeration failed
 */

router.post(
    '/insertPhysicians',
    async (req: Request, res: Response, next: NextFunction) => {

        let
            error: Error | undefined,
            resp: any;

        const reqBody: AllPhysiciansRequest = req.body;

        if (Object.keys(reqBody).length === 0) {
            error = new Error("Please insert physician name");
            (error as any).status = 400;
            return next(error);

        }

        try {
            resp = await postPhysician(reqBody);
        } catch (err) {
            return next(new Error(error?.message))
        }

        if (resp.error) {
            error = new Error(resp.error);
            (error as any).status = 400;
            return next(error);
        }

        res.status(200).send(resp);
    },
);

/**
 * @swagger
 * 
 * /api/appointments/addAppointment/{IdPhysician}:
 *  post:
 *      description: Add an appointment
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: Add appointment
 *            required: true  
 *            schema:
 *              $ref: '#/definitions/AddAppointment'
 *          - in: path
 *            name: IdPhysician
 *            required: true
 *            type: number
 *      responses:
 *          200:
 *              description: Appointment created successfully
 *          400:
 *              description: Failed to create appointment
 */

router.post(
    "/addAppointment/:IdPhysician",
    checkTime,
    async (req: Request, res: Response, next: NextFunction) => {

        let
            error: Error | undefined,
            resp: any;

        const
            { IdPhysician } = req.params,
            newApp: NewAppointRequest = req.body;

        try {
            resp = await checkAvailability(newApp.date_column, newApp.time_column, Number(IdPhysician));

            if (resp && resp.error) {
                error = new Error(resp.error);
                (error as any).status = 400;
                return next(error);
            }

            resp = await postAppointment(newApp, Number(IdPhysician));
        } catch (err: any) {
            return next(new Error(err))
        }
        
        res.status(200).send(resp)
    },
);

/**
 * @swagger
 * 
 * /api/appointments/cancelAppointment:
 *  delete:
 *      description: Cancel an appointment
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: IdAppointment
 *            required: true
 *            type: integer
 *            description: The Id of the appointment to be canceled
 *          - in: query
 *            name: IdPhysician
 *            required: true
 *            type: integer
 *            description: The Id of the physician associated with the appointment
 *      responses:
 *          200:
 *              description: Appointment canceled successfully
 *          400:
 *              descripotion: Invalid query parameters
 */

router.delete(
    '/cancelAppointment',
    async (req: Request, res: Response, next: NextFunction) => {
        let resp: any;

        const { IdAppointment, IdPhysician } = req.query;
        
        try {
            resp = await deleteAppointment(Number(IdAppointment), Number(IdPhysician));
        } catch (err: any) {
            return next(new Error(err))
        }
        
        res.status(200).send(resp);
    },
);

export default router;