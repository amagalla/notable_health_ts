import { Express } from "express";

declare module "./setupRoutes" {
  function setupRoutes(app: Express): void;
  export default setupRoutes;
}
