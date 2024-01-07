import { Router } from "express";
import indexPage from "./pages/index";
import contentsService from "./services/contents";

export const router = Router()
  .get("/", indexPage)
  .get("/contents", contentsService);
