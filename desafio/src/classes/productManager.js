import fs from "fs";
import path from "path";
import __dirname from "../utils.js"

class ProductManager{
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`)
    }
    getProducts = async()=>{
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8")
            const products = JSON.parse(data) //convierto en objeto
            return products;
        }else{
            return []
        } 
    }
    createProducts = async(product)=>{
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1
        }else{
            product.id = products[products.length-1].id+1;
        }
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,"\t"))
        return products;
    }
    getProductById= async(pId)=>{
        try {
            const products = await this.getProducts();
            let find_product_by_id = products.find((el)=> el.id == pId)
            if(find_product_by_id){
                return find_product_by_id;
            }else{
                return "Producto no encontrado."
            }    
        } catch (error) {
            return "Error en la ejecucion.";
        }
        
    }

    deleteProduct = async (pId) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id == pId);

            if (productIndex !== -1) {
                products.splice(productIndex, 1)[0];
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                return products;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }

    updateProduct = async (pId, updatedProduct) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id == pId);

            if (productIndex !== -1) {
                products[productIndex] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    };



}

export {ProductManager};