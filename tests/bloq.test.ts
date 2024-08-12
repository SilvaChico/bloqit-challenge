import request from 'supertest';
import express from 'express';
import {
    getBloqs,
    createBloq,
    updateBloq,
    deleteBloq,
    getBloq,
    getBloqLockers
} from '../src/controllers/bloqs';
import { Bloq } from '../src/models';
import { readData, writeData } from '../src/database';

jest.mock('../src/database');

const app = express();
app.use(express.json());
app.get('/api/bloqs', getBloqs);
app.post('/api/bloqs', createBloq);
app.put('/api/bloqs/:id', updateBloq);
app.delete('/api/bloqs/:id', deleteBloq);
app.get('/api/bloqs/:id', getBloq);
app.get('/api/bloqs/:id/lockers', getBloqLockers);

const mockBloqs: Bloq[] = [
    {
        id: "1",
        title: "Bloq 1",
        address: "Location 1",
    },
    {
        id: "2",
        title: "Bloq 2",
        address: "Location 2",
    }
];

const mockLockers = [
    { id: "1", bloqId: "1", name: "Locker 1" },
    { id: "2", bloqId: "1", name: "Locker 2" },
    { id: "3", bloqId: "2", name: "Locker 3" }
];

describe('Bloqs API', () => {
    beforeEach(() => {
        (readData as jest.Mock).mockImplementation((dataType: string) => {
            if (dataType === 'bloqs') {
                return Promise.resolve([...mockBloqs]);
            } else if (dataType === 'lockers') {
                return Promise.resolve([...mockLockers]);
            }
        });
        (writeData as jest.Mock).mockResolvedValue(undefined);
    });

    it('should get all bloqs', async () => {
        const response = await request(app).get('/api/bloqs');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockBloqs);
    });

    it('should get a bloq by ID', async () => {
        const response = await request(app).get('/api/bloqs/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockBloqs[0]);
    });

    it('should return 404 if bloq not found', async () => {
        const response = await request(app).get('/api/bloqs/nonexistent-id');
        expect(response.status).toBe(404);
    });

    it('should create a new bloq', async () => {
        const newBloq = {
            title: "New Bloq 3",
            address: "New Location 3",
        };
        const response = await request(app).post('/api/bloqs').send(newBloq);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(newBloq);
    });

    it('should not create a new bloq', async () => {
        const newBloq = {
            title: "New Bloq 3",
        };
        const response = await request(app).post('/api/bloqs').send(newBloq);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: {
                "code": "invalid_type",
                "expected": "string",
                "message": "Required",
                "path": [
                    "address",
                ],
                "received": "undefined",
            }
        });
    });

    it('should update an existing bloq', async () => {
        const updatedBloq = {
            title: "Updated Bloq 1",
            address: "Updated Location 1",
        };
        const response = await request(app).put('/api/bloqs/1').send(updatedBloq);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedBloq);
    });

    it('should delete a bloq', async () => {
        const response = await request(app).delete('/api/bloqs/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-exitent bloq', async () => {
        const response = await request(app).delete('/api/bloqs/nonexistent-id');
        expect(response.status).toBe(404);
    });

    it('should get lockers associated with a bloq', async () => {
        const response = await request(app).get('/api/bloqs/1/lockers');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: "1", bloqId: "1", name: "Locker 1" },
            { id: "2", bloqId: "1", name: "Locker 2" }
        ]);
    });

    it('should not get lockers associated with a bloq', async () => {
        const response = await request(app).get('/api/bloqs/10/lockers');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ "error": "Bloq not found" });
    });
});