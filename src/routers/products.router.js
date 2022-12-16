import { Router } from "express";
import fs from "fs";

const products = JSON.parse(fs.readFileSync("Products.json", "utf-8"));
const productsRouter = Router();

// LIMITE DE PRODUCTOS PARA VER --> GET --> localhost:8080/api/products
productsRouter.get("/", (req, res) => {
    if (fs.existsSync("Products.json")) {
        const limit = req.query.limit;
            if (limit == '') {
                return res.json(products);
            } else {
                let limitProd = products.slice (0,limit);
                res.json (limitProd);
            }
    } else {
        res.status(404).send({ error: 'File not found'});
    }
});

// SELECCIONA POR ID --> GET --> localhost:8080/api/products/:pid?
productsRouter.get("/:pid?", (req, res) => {
    const {pid} = req.params;
        if (fs.existsSync("Products.json")) {
            const searchProd = products.find ((product) => product.id == pid) ;
                if (searchProd) {
                    res.send(searchProd);
                } else {
                    res.status(404).send({ error: 'Product not found (search)' });
                }
        } else {
            res.status(404).send({ error: 'File not found'});
        }
});

// AGREGAR NUEVO PRODUCTO --> POST --> localhost:8080/api/products
productsRouter.post("/", (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnail } = req.body;
    let checkForm = req.body;
        if (fs.existsSync("Products.json")) {
            if (!checkForm.title || !checkForm.description || !checkForm.code || !checkForm.price || 
                !checkForm.status || !checkForm.stock || !checkForm.category || !checkForm.thumbnail) {
                res.status(404).send({ error: 'Incomplete values'});
            } else {
                const tempoProd = {title, description, code, price, status, stock, category, thumbnail };
                const newId = Math.floor(Math.random() * (100 - 1)) + 1;
                const newProd = { id: newId, ...tempoProd }
                products.push(newProd);
                fs.writeFileSync("Products.json", JSON.stringify(products));
                res.status(201).send(products);
            }
        } 
        fs.writeFileSync("Products.json", JSON.stringify(products));
        res.status(201).send(products);
});

//ACTUALIZAR PRODUCTO POR ID --> PUT --> localhost:8080/api/products/:pid?
productsRouter.put("/:pid?", (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnail } = req.body;
    const {pid} = req.params;
    let checkForm = req.body;
        if (fs.existsSync("Products.json")) {
            if (!checkForm.title || !checkForm.description || !checkForm.code || !checkForm.price || 
                !checkForm.status || !checkForm.stock || !checkForm.category || !checkForm.thumbnail) {
                res.status(404).send({ error: 'Incomplete values'});
            } else {
                const searchProd = products.find ((product) => product.id == pid);
                    if (searchProd) {
                        const filterProd = products.filter((product) => product.id != pid);  
                        const refreshProd= filterProd;  
                        const tempoProd = {title, description, code, price, status, stock, category, thumbnail };
                        const idProduct = pid;
                        const updateProd = { id: idProduct, ...tempoProd }
                        refreshProd.push(updateProd);
                        fs.writeFileSync("Products.json", JSON.stringify(refreshProd));
                        res.status(200).json(refreshProd);
                    }  else {
                        res.status(404).send({ error: 'Product not found (update)' });
                    }
                } 
            } 
        res.status(404).send({ error: 'File not found'});
});

// DELETE POR ID --> DELETE --> localhost:8080/api/products/:pid?
productsRouter.delete("/:pid?", (req, res) => {
    const {pid} = req.params;
        if (fs.existsSync("Products.json")) {
            const searchProd = products.find ((product) => product.id == pid) ;
                if (searchProd) {
                    const deleteProduct = products.filter((product) => product.id != pid);
                    fs.writeFileSync("Products.json", JSON.stringify(deleteProduct));
                    res.status(200).json(deleteProduct);
                }  else {
                    res.status(404).send({ error: 'Product not found (delete)' });
                }
        } else {
            res.status(404).send({ error: 'File not found'});
        }
});

export default productsRouter;

/* postman > post > body > raw > json --> POST --> localhost:8080/api/products

    {
        "title": "Producto prueba",
        "description": "Este es un producto prueba",
        "code": "abc126",
        "price": 200,
        "status": true,
        "stock": 25,
        "category": "producto",
        "thumbnail": "Sin imagen"
    }

*/