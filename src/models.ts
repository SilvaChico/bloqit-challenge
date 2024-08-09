export enum RentStatus {
    CREATED = "CREATED",
    WAITING_DROPOFF = "WAITING_DROPOFF",
    WAITING_PICKUP = "WAITING_PICKUP",
    DELIVERED = "DELIVERED"
}

export enum RentSize {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL"
}

export type Rent = {
    id: string;
    lockerId: string;
    weight: number;
    size: RentSize;
    status: RentStatus;
    createdAt: Date;
    droppedOffAt?: Date;
    pickedUpAt?: Date;
}

export enum LockerStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export type Locker = {
    id: string;
    bloqId: string;
    status: LockerStatus;
    isOccupied: boolean;
}

export type Bloq = {
    id: string;
    title: string;
    address: string;
}
