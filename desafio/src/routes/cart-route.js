import { Router } from "express";
import { CartManager } from "../classes/cartManager.js";
const router = Router();
const path = "cart.json"
const cartManager = new CartManager(path);


router.get("/", async (req, res) => {
    try {
        // Obtener todos los carritos
        const allCarts = await cartManager.getCarts();

        res.status(200).json({
            status: "success",
            message: "Lista de carritos.",
            carts: allCarts
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista de carritos." });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        const cartProducts = await cartManager.getCartProducts(cid);

        res.status(200).json({
            status: "success",
            message: `Productos en el carrito con ID ${cid}.`,
            products: cartProducts
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos del carrito." });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = {
            id: Date.now(), 
            products: []
        };
        await cartManager.createCart(newCart);

        res.status(201).json({
            status: "success",
            message: "Nuevo carrito creado.",
            cart: newCart
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito." });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);

        res.status(200).json({
            status: "success",
            message: `Producto agregado al carrito con ID ${cid}.`,
            cart: updatedCart
        });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito." });
    }
});

router.put("/:cid", async (req,res)=>{ 
    const cId = req.params.cid
    
    try {
        const cart = await cartManager.getCartProducts(cId);
        if (!cart) {
            return res.status(404).json({ error: "Carrrito no encontrado." });
        }
        const updatedCart= req.body;

        const newcart = {
            ...cart,
            ...updatedCart,
            id: cart.id 
        };
        await cartManager.updateCart(cId, newcart);
        const updatedCarts = await cartManager.getCarts();
        res.status(200).json({
            status: "success",
            message: `Carrito con ID ${cId} actualizado correctamente.`,
            carts: updatedCarts
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
})


router.delete("/:pcId", async (req,res)=>{
    const pcId = req.params.pcId;
    res.send({
        status: "success",
        message: `Ruta DELETE de CART con ID: ${pcId} `
    });
})


export {router as CartRouter};






