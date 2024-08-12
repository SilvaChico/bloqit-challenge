import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { readData, writeData } from '../database';
import { Rent, RentStatus, RentSize, Locker } from '../models';

const RentSchema = z.object({
    id: z.string().uuid(),
    lockerId: z.string().uuid(),
    weight: z.number().positive(),
    size: z.nativeEnum(RentSize),
    status: z.nativeEnum(RentStatus),
    createdAt: z.date(),
    droppedOffAt: z.date().optional(),
    pickedUpAt: z.date().optional()
});

const CreateRentSchema = RentSchema.omit({ id: true, createdAt: true }).extend({
    createdAt: z.date().default(() => new Date())
});
const UpdateRentSchema = RentSchema.partial().omit({ id: true, createdAt: true });

export const getRents = async (req: Request, res: Response) => {
    const rents: Rent[] = await readData('rents');
    res.json(rents);
};

export const getRentById = async (req: Request, res: Response) => {
    const rents: Rent[] = await readData('rents');
    const rent = rents.find(rent => rent.id === req.params.id);

    if (!rent) {
        return res.status(404).json({ error: 'Rent not found' });
    }

    res.json(rent);
};

export const createRent = async (req: Request, res: Response) => {
    const result = CreateRentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    const rents: Rent[] = await readData('rents');
    const newRent: Rent = { ...result.data, id: uuidv4(), createdAt: new Date() };
    rents.push(newRent);
    await writeData('rents', rents);
    res.json(newRent);
};

export const updateRent = async (req: Request, res: Response) => {
    // Assumes that a rent cannot change its lcokerId
    if (req.body.lockerId) {
        return res.status(400).json({ error: 'Updating lockerId is not allowed' });
    }

    const rents: Rent[] = await readData('rents');
    const rentIndex = rents.findIndex(rent => rent.id === req.params.id);

    if (rentIndex === -1) {
        return res.status(404).json({ error: 'Rent not found' });
    }

    const result = UpdateRentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    const updatedRent: Rent = { ...rents[rentIndex], ...result.data };
    rents[rentIndex] = updatedRent;
    await writeData('rents', rents);
    res.json(updatedRent);
};

export const deleteRent = async (req: Request, res: Response) => {
    const rents: Rent[] = await readData('rents');
    const rentIndex = rents.findIndex(rent => rent.id === req.params.id);

    if (rentIndex === -1) {
        return res.status(404).json({ error: 'Rent not found' });
    }

    rents.splice(rentIndex, 1);
    await writeData('rents', rents);
    res.status(204).send();
};

export const getRent = async (req: Request, res: Response) => {
    const rents: Rent[] = await readData('rents');
    const rent = rents.find(rent => rent.id === req.params.id);

    if (!rent) {
        return res.status(404).json({ error: 'Rent not found' });
    }

    res.json(rent);
}
