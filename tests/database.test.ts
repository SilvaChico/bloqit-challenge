import { readData, writeData } from '../src/database';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

const dataPath = path.join(__dirname, '../data');

describe('Database functions', () => {
    const entity = 'testEntity';
    const filePath = path.join(dataPath, `${entity}.json`);
    const mockData = { id: '1', name: 'Test' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('readData should read and parse JSON data from file', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

        const data = await readData(entity);

        expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
        expect(data).toEqual(mockData);
    });

    it('writeData should write JSON data to file', async () => {
        await writeData(entity, mockData);

        expect(fs.writeFile).toHaveBeenCalledWith(filePath, JSON.stringify(mockData, null, 2));
    });
});