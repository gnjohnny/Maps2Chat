import { Router } from 'express';
import { getLeads, contactLead, archiveLead, createLead } from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';

export const leadRouter = Router();

// Apply requireAuth middleware to all lead routes
leadRouter.use(requireAuth);

leadRouter.get('/', getLeads);
leadRouter.post('/', createLead);
leadRouter.patch('/:id/contact', contactLead);
leadRouter.patch('/:id/archive', archiveLead);
