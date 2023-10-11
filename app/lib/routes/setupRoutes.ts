import express, { Express } from "express";
import fs from "fs";
import path from "path";

function setupRoutes(app: Express) {
  const apiRoutesDir = path.join(__dirname, "api");

  fs.readdirSync(apiRoutesDir).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const routePath = path.join(apiRoutesDir, file);
      const route = require(routePath).default;

      const routeName = path.basename(routePath, path.extname(routePath));

      app.use(`/api/${routeName}`, route);
    }
  });
}

export default setupRoutes;