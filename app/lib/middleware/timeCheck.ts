import express, { Request, Response, NextFunction } from "express"

const checkTime = async (req: Request, res: Response, next: NextFunction) => {
    const { time_column } = req.body;

    let err: Error;
    
    const timeSplit = time_column.split(':');
    const seconds = Number(timeSplit[1].replace(/[^0-9]/g, ''));

    if (seconds % 15 !== 0) {
        err = new Error('Invalid time');
        (err as any).status = 400;
        return next(err);
    }

    return next();
};

export {
    checkTime,
}