const sqlite = require('sqlite3');
const fetch = require('node-fetch');
const db = new sqlite.Database('db/database.db');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.text());

function otherFunc() {
    function createTable() {

        const query = 'CREATE TABLE products(pid char(20) primary key, title string not null, price string not null, desc string not null, category string not null, image string, rating string)';

        db.exec(query, (err) => {
            if (err) {
                console.log('Something went wrong');
                return;
            }
            console.log('everything is fine');
        });
    }

    async function loadDataToTable() {
        const res = await fetch('https://fakestoreapi.com/products');
        const payload = await res.json();
        // console.log(payload);
        try {
            for (const e of payload) {
                const pid = genRanHex(20);
                const title = encodeToHex(e.title)
                const price = e.price;
                const desc = encodeToHex(e.description);
                const category = encodeToHex(e.category);
                const image = encodeToHex(e.image);
                const rating = encodeToHex(JSON.stringify(e.rating));
                const query = `INSERT INTO products(pid, title, price, desc, category, image, rating) VALUES('${pid}', '${title}', '${price}', '${desc}', '${category}', '${image}', '${rating}')`
                await addEntry(query);
            }
        } catch (err) {
            console.log('Error occurred: ', err);
        }

    }

    function deleteTable() {
        db.exec('DROP table products', (err) => {
            if (err) {
                console.log('got an err');
                return
            }
            console.log('table dropped');
        })
    }

    function addEntry(query) {
        return new Promise((resolve, reject) => {
            db.exec(query, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

// Get Products List
function getData(id = null) {
    if (id === null) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * from products', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
        })
    }
    return new Promise((resolve, reject) => {
        db.all(`SELECT * from products where pid='${id}'`, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        })
    })

}

// Get products list from cart
function getCartData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * from cart', (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        })
    });
}


function setCartData(payload) {
    const pid = payload.pid;
    const quantity = payload.quantity;
    return new Promise((resolve, reject) => {
        db.all(`SELECT pid from cart where pid='${pid}'`, (err, rows) => {
            if (err) return reject(err)
            console.log('from db: ', rows);

            // IF no PID
            if (rows.length === 0) {
                // INSERT QUERY
                console.log('Adding a new product to the cart');
                db.exec(`INSERT INTO cart VALUES('${pid}', '${quantity}')`, (err) => {
                    if (err) return reject(err);
                    return resolve(true);
                });

            }

            // UPDATE QUERY
            console.log('Updating the cart list by changing the quantity');
            db.exec(`UPDATE cart set quantity='${quantity}' where pid='${pid}'`, (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    });

    // console.log(payload);
}

function deleteCartData(pid) {
    return new Promise((resolve, reject) => {
        db.exec(`DELETE from cart where pid='${pid}'`, (err) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
    // console.log('requesting to delete the entry: ', pid);
}

app.get('/', async(req, res) => {
    res.send('Hello World!');
});

app.get('/products', async(req, res) => {
    if (req.query.pid === null) {
        const rows = await getData();
        let temprows = [];
        console.log('/products');
        console.log(req.query.search);
        for (const e of rows) {
            const title = decodeToString(e.title)
            const desc = decodeToString(e.desc)
            const category = decodeToString(e.category)
            const image = decodeToString(e.image)
            const rating = JSON.parse(decodeToString(e.rating))

            // console.log(title);
            if (req.query.search !== undefined) {
                const regex = new RegExp(`.*?${req.query.search}.*`, 'gi');
                const result = regex.exec(title);
                if (result !== null) {
                    temprows.push({ pid: e.pid, title, price: e.price, desc, category, image, rating })
                }
            } else {
                temprows.push({ pid: e.pid, title, price: e.price, desc, category, image, rating })
            }

            if (req.query.sort !== undefined) {
                // pasc pdesc
                if (req.query.sort === 'pasc') {
                    temprows = temprows.sort((a, b) => {
                        if (a.price < b.price) {
                            return -1;
                        }
                        return 0;
                    });
                } else if (req.query.sort === 'pdesc') {
                    temprows = temprows.sort((a, b) => {
                        if (a.price > b.price) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }

            if (req.query.category !== undefined) {
                temprows = temprows.filter((e, i) => {
                    const regex = new RegExp(`^${req.query.category}.*`, 'gi');
                    const match = regex.exec(e.category);
                    if (match !== null) {
                        return e;
                    }
                });
            }
        }
        res.send(temprows)
        return;
    }
    const rows = await getData(req.query.pid);
    let temprows = [];
    console.log('/products');
    console.log(req.query.search);
    for (const e of rows) {
        const title = decodeToString(e.title)
        const desc = decodeToString(e.desc)
        const category = decodeToString(e.category)
        const image = decodeToString(e.image)
        const rating = JSON.parse(decodeToString(e.rating))

        // console.log(title);
        if (req.query.search !== undefined) {
            const regex = new RegExp(`.*?${req.query.search}.*`, 'gi');
            const result = regex.exec(title);
            if (result !== null) {
                temprows.push({ pid: e.pid, title, price: e.price, desc, category, image, rating })
            }
        } else {
            temprows.push({ pid: e.pid, title, price: e.price, desc, category, image, rating })
        }

        if (req.query.sort !== undefined) {
            // pasc pdesc
            if (req.query.sort === 'pasc') {
                temprows = temprows.sort((a, b) => {
                    if (a.price < b.price) {
                        return -1;
                    }
                    return 0;
                });
            } else if (req.query.sort === 'pdesc') {
                temprows = temprows.sort((a, b) => {
                    if (a.price > b.price) {
                        return -1;
                    }
                    return 0;
                });
            }
        }

        if (req.query.category !== undefined) {
            temprows = temprows.filter((e, i) => {
                const regex = new RegExp(`^${req.query.category}.*`, 'gi');
                const match = regex.exec(e.category);
                if (match !== null) {
                    return e;
                }
            });
        }
    }

    res.send(temprows)
    return;

});

app.get('/cart', async(req, res) => {
    try {

        const cartitems = await getCartData();
        res.send(cartitems);
        // res.sendStatus(501);
    } catch (err) {
        console.log(err);
        res.sendStatus(503);
    }
});

app.post('/cart', async(req, res) => {
    try {
        const payload = JSON.parse(req.body);
        // console.log({payload});
        if (payload.type === 'DELETE') {
            const dbres = await deleteCartData(payload.pid);
            if (dbres === true) {
                return res.sendStatus(200);
            }
        } else {
            for (const e of payload) {
                await setCartData(e);
            }
            return res.sendStatus(200);
        }
        res.sendStatus(501);
    } catch (err) {
        console.log(err);
        res.sendStatus(501);
    }
});

function main() {
    const HTTP_PORT = 3000;

    app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`Server running on port: ${HTTP_PORT}`);
    });
}

function genRanHex(len) {
    const charset = 'abcdef0123456789'
    let hexstr = '';
    for (let i = 0; i < len; i++) {
        const rannum = parseInt(Math.random() * charset.length);
        hexstr += charset[rannum];
    }
    return hexstr;
}

function encodeToHex(str) {
    let hexstr = ''
    for (let i = 0; i < str.length; i++) {
        hexstr += str.charCodeAt(i).toString(16);
    }
    return hexstr;
}

function decodeToString(hexstr) {
    let str = '';
    for (let i = 0; i < hexstr.length; i = i + 2) {
        const e = hexstr[i] + hexstr[i + 1];
        const decimal = parseInt(e, 16)
        const char = String.fromCharCode(decimal);
        str += (char);
    }

    return str;
}

main();