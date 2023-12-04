import express from "express";
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import {Server} from "socket.io"; //este server se instalara a partir del server http.
//rutas
import { CartRouter } from "./routes/cart-route.js";
import { ProductsRouter } from "./routes/products-route.js";
import { ViewsRouter } from "./routes/viewsRouter.js";


const PORT = 8080;
const app = express();
//middlewares necesarios para nuestro servidor
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//establecemos public como alojamiento de files statios
app.use(express.static(`${__dirname}/public`))
const httpServer = app.listen(PORT, ()=>{
    `El servidor funciona en el puerto: ${PORT}`
})
//aca instalamos el motor de plantilla
app.engine("handlebars",handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname+"/views");
//asi aplicamos websocket
const socketServer = new Server(httpServer); 

//routes
app.use("/", ViewsRouter)//que levante la ruta de views
app.use("/api/carts",CartRouter)
app.use("/api/products", ProductsRouter)

export { app, httpServer, socketServer };






