const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const db = require('./db'); // Import the SQLite database instance

app.post('/api/categories', (req, res) => {
    const { name } = req.body;

    // Insert the new category into the 'categories' table
    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    stmt.run(name, err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Category added successfully' });
    });
    stmt.finalize();
});

app.get('/api/categories', (req, res) => {
    // Retrieve categories from the 'categories' table
    db.all('SELECT * FROM categories', (err, categories) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(categories);
    });
});



// adding a product
app.post('/api/products', (req, res) => {
    const { name, category_id } = req.body;

    // Insert the new product into the 'products' table
    const stmt = db.prepare('INSERT INTO products (name, category_id) VALUES (?, ?)');
    stmt.run(name, category_id, err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Product added successfully' });
    });
    stmt.finalize();
});

// GET endpoint to retrieve products within a category by name
app.get('/api/products/:categoryName', (req, res) => {
    const { categoryName } = req.params;

    // Retrieve products from the 'products' table for a specific category name
    db.all('SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE name = ?)', categoryName, (err, products) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(products);
    });
});

// GET endpoint to retrieve all products
app.get('/api/products', (req, res) => {
    // Retrieve all products from the 'products' table
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(products);
    });
});




// GET endpoint to sort products based on a sorting option
app.get('/api/sort/products/:sortField', (req, res) => {
    const { sortField } = req.params;
    const validSortFields = ['name', 'category_id'];
    if (validSortFields.includes(sortField)) {
        const query = `SELECT * FROM products ORDER BY ${sortField}`;

        db.all(query, (err, products) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(products);
        });
    } else {
        res.status(400).json({ error: 'Invalid sorting field' });
    }
});

// GET endpoint to sort products based on a product name
app.get('/api/sort/products/byName/:productName', (req, res) => {
    const { productName } = req.params;

    // Sort the products based on the requested product name
    const query = `SELECT * FROM products WHERE name = ?`;

    db.all(query, productName, (err, products) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(products);
    });
});


app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
    db.close();
    process.exit();
});
