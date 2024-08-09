import request from 'supertest';
import express from 'express';
import {
    getLockers,
    createLocker,
    updateLocker,
    deleteLocker,
    getLocker,
    getLockersRents
} from './lockers';
import { Locker, LockerStatus, Bloq, Rent, RentSize, RentStatus } from '../models';
import { readData, writeData } from '../database';
import { v4 as uuidv4 } from 'uuid';
import { mock } from 'node:test';



jest.mock('../database');

const app = express();
app.use(express.json());
app.get('/api/lockers', getLockers);
app.post('/api/lockers', createLocker);
app.put('/api/lockers/:id', updateLocker);
app.delete('/api/lockers/:id', deleteLocker);
app.get('/api/lockers/:id', getLocker);
app.get('/api/lockers/:id/rents', getLockersRents);


const lockerId1 = uuidv4();
const lockerId2 = uuidv4();
const lockerId3 = uuidv4();

const bloqId1 = uuidv4();
const bloqId2 = uuidv4();

const mockLockers: Locker[] = [
    { id: lockerId1, bloqId: bloqId1, status: LockerStatus.OPEN, isOccupied: false },
    { id: lockerId2, bloqId: bloqId1, status: LockerStatus.OPEN, isOccupied: false },
    { id: lockerId3, bloqId: bloqId2, status: LockerStatus.CLOSED, isOccupied: false }
];

const mockBloqs: Bloq[] = [
    { id: bloqId1, title: "Bloq 1", address: "Location 1" },
    { id: bloqId2, title: "Bloq 2", address: "Location 2" }
];

const mockRents: Rent[] = [
    { id: "1", lockerId: lockerId1, weight: 10, size: RentSize.M, status: RentStatus.CREATED, createdAt: new Date() },
    { id: "2", lockerId: lockerId1, weight: 5, size: RentSize.S, status: RentStatus.DELIVERED, createdAt: new Date() },
];

describe('Lockers API', () => {
    beforeEach(() => {
        (readData as jest.Mock).mockImplementation(dataType => {
            if (dataType === 'lockers') {
                return Promise.resolve([...mockLockers]);
            }
            if (dataType === 'bloqs') {
                return Promise.resolve([...mockBloqs]);
            }
            if (dataType === 'rents') {
                return Promise.resolve([...mockRents]);
            }
        });
        (writeData as jest.Mock).mockResolvedValue(undefined as never);
    });

    it('should get all lockers', async () => {
        const response = await request(app).get('/api/lockers');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockLockers);
    });

    it('should get a locker by ID', async () => {
        const response = await request(app).get(`/api/lockers/${lockerId1}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockLockers[0]);
    });

    it('should return 404 when getting a non-existent locker', async () => {
        const response = await request(app).get('/api/lockers/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Locker not found' });
    });

    it('should create a new locker', async () => {
        const newLocker = { bloqId: bloqId1, status: LockerStatus.OPEN, isOccupied: false };
        const response = await request(app)
            .post('/api/lockers')
            .send(newLocker);
        expect(response.status).toBe(200);
        expect(response.body.bloqId).toEqual(bloqId1);
        expect(response.body.status).toEqual(LockerStatus.OPEN);
    });

    it('should update a locker by ID', async () => {
        const updatedLocker = { isOccupied: true, status: LockerStatus.CLOSED };
        const response = await request(app)
            .put(`/api/lockers/${lockerId1}`)
            .send(updatedLocker);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...mockLockers[0], ...updatedLocker });
    });

    it('should not update a locker with an invalid status', async () => {
        const updatedLocker = { status: "INVALID" };
        const response = await request(app)
            .put(`/api/lockers/${lockerId1}`)
            .send(updatedLocker);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: {
                "code": "invalid_enum_value",
                "message": "Invalid enum value. Expected 'OPEN' | 'CLOSED', received 'INVALID'",
                "options": [
                    "OPEN",
                    "CLOSED",
                ],
                "path": [
                    "status",
                ],
                "received": "INVALID",
            }
        });
    });

    it('should not update a locker\'s bloqId', async () => {
        const updatedLocker = { bloqId: "3" };
        const response = await request(app)
            .put(`/api/lockers/${lockerId1}`)
            .send(updatedLocker);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Updating bloqId is not allowed"
        });
    });

    it('should return 404 when updating a non-existent locker', async () => {
        const updatedLocker = { name: "Non-existent Locker" };
        const response = await request(app)
            .put('/api/lockers/999')
            .send(updatedLocker);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Locker not found' });
    });

    it('should delete a locker by ID', async () => {
        const response = await request(app).delete(`/api/lockers/${lockerId1}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent locker', async () => {
        const response = await request(app).delete('/api/lockers/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Locker not found' });
    });

    it('should get rents associated with a locker', async () => {
        const response = await request(app).get(`/api/lockers/${lockerId1}/rents`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRents.map(rent => ({ ...rent, createdAt: rent.createdAt.toISOString() })));
    });

    it('should return 404 when getting rents for a non-existent locker', async () => {
        const response = await request(app).get('/api/lockers/999/rents');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Locker not found' });
    });

    it('should return an empty array when a locker has no rents', async () => {
        const response = await request(app).get(`/api/lockers/${lockerId3}/rents`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});