import { Router } from "express";
const router = Router();
import { ProductManager } from "../classes/productManager.js";

const path = "products.json"
const productManager = new ProductManager(path);
//vistas
router.get("/", async (req,res)=>{
    try {
        const products = await productManager.getProducts();
        res.render("home",{products})
    } catch (error) {
        res.status(500).json({ error: "Error al listar los productos." });
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products }); // Renderiza la vista con los productos actuales
    } catch (error) {
        res.status(500).json({ error: "Error al listar los productos en tiempo real." });
    }
});






export {router as ViewsRouter}






