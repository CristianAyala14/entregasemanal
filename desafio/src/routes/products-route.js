import { Router } from "express";
import { ProductManager } from "../classes/productManager.js";
import { uploader } from "../utils.js";
import { socketServer } from "../app.js"; // Ajusta la ruta según tu estructura de archivos

const router = Router();
const path = "products.json"
const productManager = new ProductManager(path);
//testing aproved.
router.get("/", async (req,res)=>{
    const limit = req.query.limit;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.send({
                status: "succes",
                message: "Productos enlistados.",
                productos: limitedProducts
            });        
        } else {
            res.send({
                status: "success",
                message: "Productos enlistados.",
                productos: products
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al listar los productos." });
    }
})
//tested 
router.get("/:pid", async (req,res)=>{
    const pId = req.params.pid
    try {
        const product = await productManager.getProductById(pId);
        res.send({
            status: "success",
            message: "Producto encontrado.",
            product: product
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})
//tested 
router.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        const filename = req.file.filename;
        if (!filename) {
            return res.send({
                status: "error",
                message: "No se pudo cargar la imagen"
            });
        }
        const product = req.body;
        product.thumbnail = `http://localhost:8080/product-imgs/${filename}`;
        product.status = true;
        await productManager.createProducts(product); // Espera a que la operación de creación termine
        const products = await productManager.getProducts();

        // Emito un evento a través del servidor de sockets
        socketServer.emit("products_actualizados", products);

        res.render({
            status: "success",
            message: "Producto creado.",
            products: products
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto." });
    }
});
//tested 
router.delete("/:pid", async (req,res)=>{
    try {
        let pId = req.params.pid
        const products = await productManager.deleteProduct(pId)
        // Emito un evento a través del servidor de sockets
        socketServer.emit("products_actualizados", products);

        res.send({
            status: "Correcto",
            message: "Usuario eliminado",
        })
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });

    }


    
})

router.put("/:pid", async (req, res) => {
    const pId = req.params.pid;
    try {
        const existingProduct = await productManager.getProductById(pId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        const updatedFields = req.body;

        const updatedProduct = {
            ...existingProduct,
            ...updatedFields,
            id: existingProduct.id 
        };
        await productManager.updateProduct(pId, updatedProduct);
        const updatedProducts = await productManager.getProducts();
        res.status(200).json({
            status: "success",
            message: `Producto con ID ${pId} actualizado correctamente.`,
            products: updatedProducts
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});









export {router as ProductsRouter};