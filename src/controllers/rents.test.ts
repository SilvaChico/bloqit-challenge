import request from 'supertest';
import express from 'express';
import {
    getRents,
    getRent,
    deleteRent,
    updateRent,
    createRent,
    getRentLocker,
} from './rents';
import { Rent, RentStatus, RentSize, Locker, LockerStatus, Bloq } from '../models';
import { readData, writeData } from '../database';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../database');

const app = express();
app.use(express.json());
app.get('/api/rents', getRents);
app.get('/api/rents/:id', getRent);
app.delete('/api/rents/:id', deleteRent);
app.put('/api/rents/:id', updateRent);
app.post('/api/rents', createRent);
app.get('/api/rents/:id/locker', getRentLocker);

const lockerId1 = uuidv4();
const lockerId2 = uuidv4();
const lockerId3 = uuidv4();
const mockRents: Rent[] = [
    { id: "1", lockerId: lockerId1, weight: 10, size: RentSize.M, status: RentStatus.CREATED, createdAt: new Date() },
    { id: "2", lockerId: lockerId2, weight: 5, size: RentSize.S, status: RentStatus.WAITING_DROPOFF, createdAt: new Date() },
    { id: "3", lockerId: lockerId3, weight: 15, size: RentSize.L, status: RentStatus.DELIVERED, createdAt: new Date() }
];

const bloqId1 = uuidv4();
const bloqId2 = uuidv4();
const mockLockers: Locker[] = [
    { id: lockerId1, bloqId: bloqId1, status: LockerStatus.OPEN, isOccupied: false },
    { id: lockerId2, bloqId: bloqId1, status: LockerStatus.OPEN, isOccupied: false },
    { id: lockerId3, bloqId: bloqId2, status: LockerStatus.CLOSED, isOccupied: false }
];

describe('Rents API', () => {
    beforeEach(() => {
        (readData as jest.Mock).mockImplementation(dataType => {
            if (dataType === 'rents') {
                return Promise.resolve([...mockRents]);
            }
            if (dataType === 'lockers') {
                return Promise.resolve([...mockLockers]);
            }
        });
        (writeData as jest.Mock).mockResolvedValue(undefined as never);
    });

    it('should get all rents', async () => {
        const response = await request(app).get('/api/rents');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRents.map(rent => ({ ...rent, createdAt: rent.createdAt.toISOString() })));
    });

    it('should get a rent by ID', async () => {
        const response = await request(app).get('/api/rents/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...mockRents[0],
            createdAt: mockRents[0].createdAt.toISOString()
        });
    });

    it('should create a rent', async () => {
        const newRent = {
            lockerId: lockerId1,
            weight: 10,
            size: RentSize.M,
            status: RentStatus.CREATED
        };
        const response = await request(app)
            .post('/api/rents')
            .send(newRent);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...newRent, id: expect.any(String), createdAt: expect.any(String) });
    });

    it('should return 404 when getting a non-existent rent', async () => {
        const response = await request(app).get('/api/rents/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Rent not found' });
    });

    it('should update a rent by ID', async () => {
        const updatedRent = { status: RentStatus.WAITING_PICKUP };
        const response = await request(app)
            .put('/api/rents/1')
            .send(updatedRent);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...mockRents[0], ...updatedRent, createdAt: mockRents[0].createdAt.toISOString() });
    });

    it('should not update a rent with an invalid status', async () => {
        const updatedRent = { status: "INVALID" };
        const response = await request(app)
            .put('/api/rents/1')
            .send(updatedRent);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: {
                "code": "invalid_enum_value",
                "message": "Invalid enum value. Expected 'CREATED' | 'WAITING_DROPOFF' | 'WAITING_PICKUP' | 'DELIVERED', received 'INVALID'",
                "options": [
                    "CREATED",
                    "WAITING_DROPOFF",
                    "WAITING_PICKUP",
                    "DELIVERED",
                ],
                "path": [
                    "status",
                ],
                "received": "INVALID",
            }
        });
    });

    it('should return 404 when updating a non-existent rent', async () => {
        const updatedRent = { status: RentStatus.DELIVERED };
        const response = await request(app)
            .put('/api/rents/999')
            .send(updatedRent);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Rent not found' });
    });

    it('should delete a rent by ID', async () => {
        const response = await request(app).delete('/api/rents/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent rent', async () => {
        const response = await request(app).delete('/api/rents/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Rent not found' });
    });

    it('should get the locker associated with a rent', async () => {
        const response = await request(app).get('/api/rents/1/locker');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockLockers[0]);
    });
});