import {fileURLToPath} from "url";
import {dirname} from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//multer config:
const storage = multer.diskStorage({
    destination: function(req,file,db){
        db(null,`${__dirname}/public/product-imgs`);
    },
    filename: function(req,file,db){
        db(null,`${Date.now()}-${file.originalname}`)
    }
})


export const uploader = multer({storage});
export default __dirname;
