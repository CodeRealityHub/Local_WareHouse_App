import express from "express";
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from "../controllers/customerControllers.js";


const router = express.Router();
router.post('/', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);


export default router;