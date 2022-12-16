import { Router } from "express";
import fs from "fs";

const carts = JSON.parse(fs.readFileSync("Carts.json", "utf-8"));
const cartsRouter = Router();
const productsCart = [];

// AGREGAR NUEVOS PRODUCTOS --> POST --> localhost:8080/api/carts
cartsRouter.post("/", (req, res) => {
    const {title, price, category, thumbnail } = req.body;
    let checkForm = req.body;
        if (fs.existsSync("Carts.json")) {
            if (!checkForm.title || !checkForm.price || !checkForm.category || !checkForm.thumbnail) {
                res.status(404).send({ error: 'Incomplete values'});
            } else {
                const tempoProd = {title, price, category, thumbnail };
                const newId = Math.floor(Math.random() * (100 - 1)) + 1;
                const newProd = { id: newId, ...tempoProd }
                carts.push(newProd);
                fs.writeFileSync("Carts.json", JSON.stringify(carts));
                res.status(201).send(carts);
            }
        } 
        fs.writeFileSync("Carts.json", JSON.stringify(carts));
        res.status(201).send(carts);
});

// LISTA PRODUCTOS PARA VER --> GET --> localhost:8080/api/carts
cartsRouter.get("/", (req, res) => {
    if (fs.existsSync("Carts.json")) {
        res.json(carts);
    } else {
        res.status(404).send({ error: 'File not found'});
    }
});

// SELECCIONA POR ID --> GET --> localhost:8080/api/carts/:cid?
cartsRouter.get("/:cid?", (req, res) => {
    const {cid} = req.params;
        if (fs.existsSync("Carts.json")) {
            const searchProd = carts.find ((cart) => cart.id == cid) ;
            if (searchProd) {
                res.send(searchProd);
            } else {
                res.status(404).send({ error: 'Product not found (search)' });
            }
        } else {
            res.status(404).send({ error: 'File not found'});
        }
});

// AGREGAR PRODUCTOS A LISTA CARRITO/COMPRA --> POST --> localhost:8080/api/carts/product/:pid?
cartsRouter.post("/product/:pid?", (req, res) => {
    const {pid} = req.params;
        if (fs.existsSync("Carts.json")) {
            const searchProd = carts.find ((cart) => cart.id == pid);
                if (searchProd) {
                    const selectProd = searchProd;
                    const idProd = selectProd.id;
                    let qty = productsCart.length;
                    const cartProd = { id: idProd, qty: qty + 1}
                    productsCart.push(cartProd);
                    const showCart = (productsCart.at(-1));
                    res.status(200).json(showCart);
                }  else {
                    res.status(404).send({ error: 'Product not found (select cart)' });
                }
        } else {
            res.status(404).send({ error: 'File not found'});
        }
});

export default cartsRouter;

/* postman > post > body > raw > json --> POST --> localhost:8080/api/carts

    {
        "title": "Producto prueba",
        "price": 200,
        "category": "producto",
        "thumbnail": "Sin imagen"
    }

*/