import fs from 'fs/promises';
import path from 'path';

const rootDir = process.cwd();
const dataPath = path.join(rootDir, 'data');

export const readData = async (entity: string) => {
    const filePath = path.join(dataPath, `${entity}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

export const writeData = async (entity: string, data: any) => {
    const filePath = path.join(dataPath, `${entity}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};