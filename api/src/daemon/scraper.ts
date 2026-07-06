import cron from "node-cron";
import { fetchKenyaPlaces } from "./placesClient";
import { formatKenyaPhoneNumber } from "../utils/phoneFormatter";
import { prisma } from "../db";
import { LeadStatus } from "@prisma/client";

export async function runIngestionDaemon(
  query: string = "shops in Nairobi",
): Promise<{ savedCount: number }> {
  console.log(`[Daemon] Ingestion sweep started for query: "${query}"...`);

  let savedCount = 0;

  try {
    const data = await fetchKenyaPlaces(query);
    const places = data.places || [];

    console.log(
      `[Daemon] Fetched ${places.length} listings from Google Places.`,
    );

    for (const place of places) {
      if (savedCount >= 10) {
        console.log(
          "[Daemon] Daily quota of 10 saved leads reached. Stopping sweep.",
        );
        break;
      }

      const address = place.formattedAddress;
      if (!address || !address.toLowerCase().includes("kenya")) {
        console.log(
          `[Daemon] Discarded place "${place.displayName?.text}": Address does not contain 'Kenya'.`,
        );
        continue;
      }

      const rawPhone = place.internationalPhoneNumber;
      if (!rawPhone) {
        console.log(
          `[Daemon] Discarded place "${place.displayName?.text}": No phone number.`,
        );
        continue;
      }

      const formattedPhone = formatKenyaPhoneNumber(rawPhone);
      if (!formattedPhone) {
        console.log(
          `[Daemon] Discarded place "${place.displayName?.text}": Phone number "${rawPhone}" could not be formatted.`,
        );
        continue;
      }

      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: [{ placeId: place.id }, { whatsappNumber: formattedPhone }],
        },
      });

      if (existingLead) {
        console.log(
          `[Daemon] Discarded duplicate place "${place.displayName?.text}" (already exists).`,
        );
        continue;
      }

      await prisma.lead.create({
        data: {
          placeId: place.id,
          name: place.displayName?.text || "Unnamed Business",
          address: address,
          whatsappNumber: formattedPhone,
          status: LeadStatus.PENDING,
        },
      });

      savedCount++;
      console.log(
        `[Daemon] Saved lead #${savedCount}: "${place.displayName?.text}" with normalized number: ${formattedPhone}`,
      );
    }
  } catch (error: any) {
    console.error("[Daemon] Error during lead ingestion:", error.message);
    throw new Error("Unknown error during lead ingestion.");
  }

  console.log(`[Daemon] Sweep completed. Saved ${savedCount} new leads.`);
  return { savedCount };
}

export function startIngestionScheduler() {
  console.log(
    "[Scheduler] Ingestion daemon registered to run daily at 9:00 AM.",
  );

  cron.schedule("0 9 * * *", async () => {
    const searchQueries = [
      "coffee shops",
      "pharmacies",
      "groceries",
      "hardware stores",
      "salons",
    ];
    const randomQuery =
      searchQueries[Math.floor(Math.random() * searchQueries.length)] +
      " in Kenya";

    try {
      await runIngestionDaemon(randomQuery);
    } catch (error) {
      console.error("[Scheduler] Scheduled ingestion run failed:", error);
    }
  });
}
