import { sseHandlers } from "express-mcp-handler";
import { mcpClient } from "./ai/McpClient";
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import mongoose from "mongoose";
import path from "path";
import { saver } from "smart-saver";
import { askController } from "./controllers/ask-controller";
import { employeeController } from "./controllers/employee-controller";
import { productController } from "./controllers/product-controller";
import { supplierController } from "./controllers/supplier-controller";
import { userController } from "./controllers/user-controller";
import { errorMiddleware } from "./middleware/error-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";
import { saleController } from "./controllers/sale-controller";
import { socketService } from "./services/socket-service";
import { ragController } from "./controllers/rag-controller";
import { northwindMcpServer } from "./ai/mcp-server";

class App {

    public async start(): Promise<void> {

        // Connect to MongoDB:
        await mongoose.connect(appConfig.mongodbConnectionString);
        // await SupplierModel.syncIndexes(); // Do synchronize indexes (like unique)

        // Configure smart-saver - images path:
        saver.config(path.join(__dirname, "assets", "images"));

        // Create our server object:
        const server = express();

        // System middleware:
        server.set("trust proxy", 1);
        securityMiddleware.registerRateLimit(server); // Prevent DoS attacks.
        securityMiddleware.headerProtection(server); // Prevent header attacks.
        server.use(cors()); // Enable CORS.
        server.use(express.json()); // Configure express to create request.body from a given JSON.
        server.use(expressFileUpload()); // Configure express to create request.files from the request.

        // Register "before" middleware:
        // server.use(loggerMiddleware.logToConsole);
        server.use(securityMiddleware.preventXss);
        server.use(securityMiddleware.blackList);

        // Register controllers:
        server.use(userController.router);
        server.use(productController.router);
        server.use(supplierController.router);
        server.use(saleController.router);
        server.use(ragController.router);
        server.use(employeeController.router);
        server.use(askController.router);


        //register mcp
        const mcpServer = northwindMcpServer.create();
        const mcpController = sseHandlers(() => mcpServer, {});
        server.get("/sse", mcpController.getHandler);
        server.post("/sse", mcpController.postHandler);
        server.post("/messages", mcpController.postHandler);

        await mcpClient.init();



        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Run server:
        const httpServer = server.listen(appConfig.port, () => console.log("Listening..."));
        socketService.start(httpServer);
    }

}

const app = new App();
app.start();

// taskkill /F /IM node.exe
