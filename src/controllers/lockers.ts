import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Locker, LockerStatus, Bloq, Rent } from '../models';
import { Request, Response } from 'express';
import { readData, writeData } from '../database';

const LockerSchema = z.object({
    status: z.nativeEnum(LockerStatus),
    bloqId: z.string().uuid(),
    isOccupied: z.boolean()
});

const UpdateLockerSchema = LockerSchema.omit({ bloqId: true }).partial();

export const getLockers = async (req: Request, res: Response) => {
    const lockers: Locker[] = await readData('lockers');
    res.json(lockers);
};

export const getLocker = async (req: Request, res: Response) => {
    const lockers: Locker[] = await readData('lockers');
    const locker = lockers.find(locker => locker.id === req.params.id);

    if (!locker) {
        return res.status(404).json({ error: 'Locker not found' });
    }

    res.json(locker);
}

export const createLocker = async (req: Request, res: Response) => {
    const result = LockerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    // check if bloqId exists
    const bloqs = await readData('bloqs');
    const bloqIndex = bloqs.findIndex((bloq: Bloq) => bloq.id === result.data.bloqId);
    if (bloqIndex === -1) {
        return res.status(400).json({ error: 'Bloq not found' });
    }


    const lockers: Locker[] = await readData('lockers');
    const newLocker: Locker = { ...result.data, id: uuidv4() };
    lockers.push(newLocker);
    await writeData('lockers', lockers);
    res.json(newLocker);
}

export const updateLocker = async (req: Request, res: Response) => {
    // Assumes that a locker cannot change its bloqId
    if (req.body.bloqId) {
        return res.status(400).json({ error: 'Updating bloqId is not allowed' });
    }
    const lockers: Locker[] = await readData('lockers');
    const lockerIndex = lockers.findIndex(locker => locker.id === req.params.id);

    if (lockerIndex === -1) {
        return res.status(404).json({ error: 'Locker not found' });
    }

    const result = UpdateLockerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    const updatedLocker = { ...lockers[lockerIndex], ...result.data };
    lockers[lockerIndex] = updatedLocker;
    await writeData('lockers', lockers);
    res.json(updatedLocker);
}

export const deleteLocker = async (req: Request, res: Response) => {
    const lockers: Locker[] = await readData('lockers');
    const lockerIndex = lockers.findIndex(locker => locker.id === req.params.id);

    if (lockerIndex === -1) {
        return res.status(404).json({ error: 'Locker not found' });
    }

    lockers.splice(lockerIndex, 1);
    await writeData('lockers', lockers);
    res.status(204).send();
}

export const getLockersRents = async (req: Request, res: Response) => {
    const lockers: Locker[] = await readData('lockers');
    const locker = lockers.find(locker => locker.id === req.params.id);

    if (!locker) {
        return res.status(404).json({ error: 'Locker not found' });
    }

    const allRents: Rent[] = await readData('rents');
    const rents = allRents.filter(rent => rent.lockerId === req.params.id);

    res.json(rents);
}