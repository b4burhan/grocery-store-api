const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Product List.html'));
});
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'AddProduct.html'));
});
app.get('/add-categories', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'AddCategory.html'));
});
app.get('/backupTable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'backupTable.html'));
});
// 
const db = new sqlite3.Database('grocery_store.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post('/api/categories', upload.single('image'), (req, res) => {
    const { name } = req.body;

    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    stmt.run(name, err => {
        if (err) {
            handleDatabaseError(err, res);
            return;
        }
        res.status(201).json({ message: 'Category added successfully' });
    });
    stmt.finalize();
});

// Retrieve all categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, categories) => {
        if (err) {
            handleDatabaseError(err, res);
            return;
        }
        res.json(categories);
    });
});
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, category_id, price } = req.body;
    const image = req.file ? req.file.filename : null; // Store the image file name

    db.serialize(() => {
        db.run("BEGIN TRANSACTION"); // Start a database transaction

        const stmt = db.prepare('INSERT INTO products (name, category_id, image, price) VALUES (?, ?, ?, ?)');

        stmt.run(name, category_id, image, price, err => {
            if (err) {
                db.run("ROLLBACK"); // Roll back the transaction in case of an error
                handleDatabaseError(err, res);
            } else {
                db.run("COMMIT"); // Commit the transaction if the insertion is successful
                res.status(201).json({ message: 'Product added successfully' });
            }
            stmt.finalize();
        });
    });
});

// Retrieve products within a category by name
app.get('/api/products/:categoryName', (req, res) => {
    const { categoryName } = req.params;

    db.all('SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE name = ?)', categoryName, (err, products) => {
        if (err) {
            handleDatabaseError(err, res);
            return;
        }
        res.json(products);
    });
});

app.get('/api/products/byName/:productName', (req, res) => {
    const { productName } = req.params;

    // Replace 'products' with the actual name of your products table
    db.all('SELECT * FROM products WHERE name = ?', productName, (err, products) => {
        if (err) {
            handleDatabaseError(err, res);
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

// Retrieve all products
app.get('/api/products', (req, res) => {
    db.all('SELECT name,price,image FROM products', (err, products) => {
        if (err) {
            handleDatabaseError(err, res);
            return;
        }
        res.json(products);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});

// Close the database connection on SIGINT
process.on('SIGINT', () => {
    db.close();
    process.exit();
});
