# Grocery Store API

This is the documentation for the Grocery Store API. This API provides functionality to manage categories and products in a grocery store.

## Getting Started

To get started with the Grocery Store API, follow the steps below.

### Prerequisites

- Node.js
- SQLite (for local database)

### Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the API server:
   ```bash
   npm start
   ```
   The API server will run at `http://localhost:3000`.

## API Endpoints

### Categories

- **GET /api/categories**

  - Description: Retrieve a list of categories.
  - Example: `http://localhost:3000/api/categories`

- **POST /api/categories**
  - Description: Create a new category.
  - Example: `http://localhost:3000/api/categories`

### Products

- **GET /api/products/:categoryName**

  - Description: Retrieve products within a specific category by name.
  - Example: `http://localhost:3000/api/products/Fruits`

- **POST /api/products**

  - Description: Create a new product.
  - Example: `http://localhost:3000/api/products`

- **GET /api/products**
  - Description: Retrieve a list of all products.
  - Example: `http://localhost:3000/api/products`

### Sorting

- **GET /api/sort/products/:sortField**

  - Description: Sort products based on the provided sorting field (e.g., 'name', 'category_id').
  - Example: `http://localhost:3000/api/sort/products/name`

- **GET /api/sort/products/byName/:productName**
  - Description: Sort products by a specific product name.
  - Example: `http://localhost:3000/api/sort/products/byName/Onion`

## Testing

To run automated tests, you can use Newman. Make sure you have Newman installed globally:

```bash
npm install -g newman
```

Then, you can run the Postman collection as follows:

```bash
newman run Grocery-Store.postman_collection.json
```
