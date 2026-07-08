import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { LeadStatus } from "@prisma/client";
import { formatKenyaPhoneNumber } from "../utils/phoneFormatter";

export async function getLeads(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status } = req.query;

    const filterStatus = status
      ? (String(status).toUpperCase() as LeadStatus)
      : undefined;

    if (filterStatus && !Object.values(LeadStatus).includes(filterStatus)) {
      res
        .status(400)
        .json({ success: false, error: "Invalid lead status query parameter" });
      return;
    }

    const leads = await prisma.lead.findMany({
      where: filterStatus ? { status: filterStatus } : undefined,
      orderBy: { fetchedAt: "desc" },
    });

    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
}

export async function contactLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const updatedLead = await prisma.lead.update({
      where: { id: String(id) },
      data: {
        status: LeadStatus.CONTACTED,
        contactedAt: new Date(),
      },
    });

    res.json({ success: true, data: updatedLead });
  } catch (error) {
    next(error);
  }
}

export async function archiveLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const updatedLead = await prisma.lead.update({
      where: { id: String(id) },
      data: {
        status: LeadStatus.ARCHIVED,
      },
    });

    res.json({ success: true, data: updatedLead });
  } catch (error) {
    next(error);
  }
}

export async function createLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, address, whatsappNumber } = req.body;

    if (!name || !address || !whatsappNumber) {
      res
        .status(400)
        .json({
          success: false,
          error: "Missing required fields: name, address, whatsappNumber",
        });
      return;
    }

    if (!address.toLowerCase().includes("kenya")) {
      res
        .status(400)
        .json({
          success: false,
          error: "Address must contain the country 'Kenya'",
        });
      return;
    }

    const formattedPhone = formatKenyaPhoneNumber(whatsappNumber);
    if (!formattedPhone) {
      res
        .status(400)
        .json({ success: false, error: "Invalid Kenyan phone number format" });
      return;
    }

    // Generate manual placeId prefixing the phone number to ensure uniqueness
    const placeId = `manual-${formattedPhone}`;

    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [{ placeId }, { whatsappNumber: formattedPhone }],
      },
    });

    if (existingLead) {
      res
        .status(400)
        .json({
          success: false,
          error: "Lead with this phone number already exists",
        });
      return;
    }

    const newLead = await prisma.lead.create({
      data: {
        placeId,
        name: String(name),
        address: String(address),
        whatsappNumber: formattedPhone,
        status: LeadStatus.PENDING,
      },
    });

    res.json({ success: true, data: newLead });
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id: String(id) },
    });

    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    // Retrieve lead to check its status
    const lead = await prisma.lead.findUnique({
      where: { id: String(id) },
    });

    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }

    if (lead.status !== LeadStatus.ARCHIVED) {
      res.status(400).json({
        success: false,
        error: "Only archived leads can be permanently deleted",
      });
      return;
    }

    await prisma.lead.delete({
      where: { id: String(id) },
    });

    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
}

