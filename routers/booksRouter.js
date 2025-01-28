import express from "express";
import {
    index,
    show,
    store,
    storeReview,
    update,
    destroy,
} from "../controllers/bookController.js";

const router = express.Router();

// Rotte

// Index - Read all
router.get("/", index);

// Show - Read one
router.get("/:id", show);

// Store - Create
router.post("/", store);

// store create review
router.post("/:id/reviews", storeReview);

// Update - Update totale
router.put("/:id", update);

// Destroy - Delete
router.delete("/:id", destroy);

// Export router
export default router;