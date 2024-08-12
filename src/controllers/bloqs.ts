import { Request, Response } from 'express';
import { Bloq, Locker } from '../models';
import { readData, writeData } from '../database';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'

const BloqSchema = z.object({
    title: z.string(),
    address: z.string(),
});

const PartialBloqSchema = BloqSchema.partial();

export const getBloqs = async (req: Request, res: Response) => {
    const bloqs: Bloq[] = await readData('bloqs');
    res.json(bloqs);
};

export const getBloq = async (req: Request, res: Response) => {
    const bloqs: Bloq[] = await readData('bloqs');
    const bloq = bloqs.find(bloq => bloq.id === req.params.id);

    if (!bloq) {
        return res.status(404).json({ error: 'Bloq not found' });
    }

    res.json(bloq);
}

export const createBloq = async (req: Request, res: Response) => {
    const result = BloqSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    const bloqs: Bloq[] = await readData('bloqs');
    const newBloq: Bloq = { ...result.data, id: uuidv4() };
    bloqs.push(newBloq);
    await writeData('bloqs', bloqs);
    res.json(newBloq);
}

export const updateBloq = async (req: Request, res: Response) => {
    const bloqs: Bloq[] = await readData('bloqs');
    const bloqIndex = bloqs.findIndex(bloq => bloq.id === req.params.id);

    if (bloqIndex === -1) {
        return res.status(404).json({ error: 'Bloq not found' });
    }

    const result = PartialBloqSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0] });
    }

    const updatedBloq = { ...bloqs[bloqIndex], ...result.data };
    bloqs[bloqIndex] = updatedBloq;
    await writeData('bloqs', bloqs);
    res.json(updatedBloq);
}

export const deleteBloq = async (req: Request, res: Response) => {
    const bloqs: Bloq[] = await readData('bloqs');
    const bloqIndex = bloqs.findIndex(bloq => bloq.id === req.params.id);

    if (bloqIndex === -1) {
        return res.status(404).json({ error: 'Bloq not found' });
    }

    bloqs.splice(bloqIndex, 1);
    await writeData('bloqs', bloqs);
    res.status(204).send();
}

export const getBloqLockers = async (req: Request, res: Response) => {
    const bloqs: Bloq[] = await readData('bloqs');
    const bloq = bloqs.find(bloq => bloq.id === req.params.id);

    if (!bloq) {
        return res.status(404).json({ error: 'Bloq not found' });
    }

    const lockers: Locker[] = await readData('lockers');
    const bloqLockers = lockers.filter(locker => locker.bloqId === req.params.id);
    res.json(bloqLockers);
}