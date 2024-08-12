# Bloqit Challenge

## Project Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd bloqit-challenge
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Build the project:**
   ```sh
   npm run build
   ```

## Running the Project

1. **Start the server:**
   ```sh
   npm start
   ```

2. **For development mode with hot-reloading:**
   ```sh
   npm run dev
   ```

The server will start on `http://localhost:3000`.

## Running Tests

1. **Run the tests:**
   ```sh
   npm test
   ```

## API Endpoints

### Bloqs

- **Get all bloqs**
  - **Endpoint:** `GET /bloqs`
  - **Description:** Retrieves a list of all bloqs.

- **Get a bloq by ID**
  - **Endpoint:** `GET /bloqs/:id`
  - **Description:** Retrieves a bloq by ID.

- **Create a new bloq**
  - **Endpoint:** `POST /bloqs`
  - **Description:** Creates a new bloq.
  - **Body:**
    ```json
    {
      "title": "string",
      "address": "string"
    }
    ```

- **Update a bloq**
  - **Endpoint:** `PUT /bloqs/:id`
  - **Description:** Updates an existing bloq by ID.
  - **Body:**
    ```json
    {
      "title": "string",
      "address": "string"
    }
    ```

- **Delete a bloq**
  - **Endpoint:** `DELETE /bloqs/:id`
  - **Description:** Deletes a bloq by ID.

- **Get lockers of a bloq**
  - **Endpoint:** `GET /bloqs/:id/lockers`
  - **Description:** Retrieves all lockers associated with a bloq by bloq ID.

### Lockers

- **Get all lockers**
  - **Endpoint:** `GET /lockers`
  - **Description:** Retrieves a list of all lockers.

- **Get a locker by ID**
  - **Endpoint:** `GET /lockers/:id`
  - **Description:** Retrieves a locker by ID.

- **Create a new locker**
  - **Endpoint:** `POST /lockers`
  - **Description:** Creates a new locker.
  - **Body:**
    ```json
    {
      "bloqId": "string",
      "status": "OPEN | CLOSED",
      "isOccupied": "boolean"
    }
    ```

- **Update a locker**
  - **Endpoint:** `PUT /lockers/:id`
  - **Description:** Updates an existing locker by ID.
  - **Body:**
    ```json
    {
      "bloqId": "string",
      "status": "OPEN | CLOSED",
      "isOccupied": "boolean"
    }
    ```

- **Delete a locker**
  - **Endpoint:** `DELETE /lockers/:id`
  - **Description:** Deletes a locker by ID.

- **Get rents of a locker**
  - **Endpoint:** `GET /lockers/:id/rents`
  - **Description:** Retrieves all rents associated with a locker by locker ID.

### Rents

- **Get all rents**
  - **Endpoint:** `GET /rents`
  - **Description:** Retrieves a list of all rents.

- **Get a rent by ID**
  - **Endpoint:** `GET /rents/:id`
  - **Description:** Retrieves a rent by ID.

- **Create a new rent**
  - **Endpoint:** `POST /rents`
  - **Description:** Creates a new rent.
  - **Body:**
    ```json
    {
      "lockerId": "string",
      "weight": "number",
      "size": "XS | S | M | L | XL",
      "status": "CREATED | WAITING_DROPOFF | WAITING_PICKUP | DELIVERED"
    }
    ```

- **Update a rent**
  - **Endpoint:** `PUT /rents/:id`
  - **Description:** Updates an existing rent by ID.
  - **Body:**
    ```json
    {
      "lockerId": "string",
      "weight": "number",
      "size": "XS | S | M | L | XL",
      "status": "CREATED | WAITING_DROPOFF | WAITING_PICKUP | DELIVERED"
    }
    ```

- **Delete a rent**
  - **Endpoint:** `DELETE /rents/:id`
  - **Description:** Deletes a rent by ID.
