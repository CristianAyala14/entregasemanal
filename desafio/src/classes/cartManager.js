import fs from "fs";
import path from "path";
import __dirname from "../utils.js"

class CartManager{
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`)
    }
    createCart = async (cart) => {
        try {
            const carts = await this.getCarts();
            carts.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    };

    getCartProducts = async (cid) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((c) => c.id == cid);

            if (cart) {
                return cart.products;
            } else {
                throw new Error("Carrito no encontrado.");
            }
        } catch (error) {
            throw new Error(`Error al obtener productos del carrito: ${error.message}`);
        }
    };

    addProductToCart = async (cid, pid) => {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((el) => el.id == cid);
            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const existingProductIndex = cart.products.findIndex((el) => el.product === pid);
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += 1;
                } else {
                    cart.products.push({ product: pid, quantity: 1 });
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
                return cart;
            } else {
                throw new Error("Carrito no encontrado.");
            }
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    };

    // ... (otros métodos según tu necesidad)

    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    };


    updateCart = async (cId, newcart) => {
    try {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((el) => el.id == cId);

        if (cartIndex !== -1) {
            carts[cartIndex] = newcart;
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            return carts;
        } else {
            throw new Error('Carrito no encontrado');
        }
    } catch (error) {
        throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
    };

    deleteCart = async (cId) => {
        try {
            const carts = await this.getCarts();
            const updatedCarts = carts.filter((el) => el.id !== cId);
            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, "\t"));
            return updatedCarts;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`);
        }
    };
}

export {CartManager};