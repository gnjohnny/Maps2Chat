import axios from "axios";

export interface PlaceEntity {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  internationalPhoneNumber?: string;
}

interface PlacesResponse {
  places?: PlaceEntity[];
}

export async function fetchKenyaPlaces(query: string): Promise<PlacesResponse> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  console.log(process.env.GOOGLE_PLACES_API_KEY);

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
  if (!apiKey) {
    // If no real API key is set, return empty places array to avoid throwing crashes in local demo runs
    console.warn(
      "Warning: GOOGLE_PLACES_API_KEY is not configured. Returning mock listings.",
    );
    return getMockPlaces(query);
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber",
  };

  const payload = {
    textQuery: query,
    locationRestriction: {
      rectangle: {
        low: {
          latitude: -4.71,
          longitude: 33.84,
        },
        high: {
          latitude: 4.63,
          longitude: 41.92,
        },
      },
    },
  };

  const response = await axios.post<PlacesResponse>(url, payload, { headers });
  return response.data;
}

// Fallback mock places for development/testing when API key is missing
function getMockPlaces(query: string): PlacesResponse {
  return {
    places: [
      {
        id: `mock-id-1-${Date.now()}`,
        displayName: { text: `Nairobi Dental Practice - Query: ${query}` },
        formattedAddress: "Ngong Road, Nairobi, Kenya",
        internationalPhoneNumber: "+254 711 223344",
      },
      {
        id: `mock-id-2-${Date.now()}`,
        displayName: { text: `Westlands Tech Hub - Query: ${query}` },
        formattedAddress: "Ring Road, Westlands, Nairobi, Kenya",
        internationalPhoneNumber: "+254 722 334455",
      },
      {
        id: `mock-id-3-${Date.now()}`,
        displayName: { text: `Mombasa Beach Boutique - Query: ${query}` },
        formattedAddress: "Nyali Road, Mombasa, Kenya",
        internationalPhoneNumber: "+254 733 445566",
      },
      {
        id: `mock-id-4-${Date.now()}`,
        displayName: { text: `Global Goods (Missing Country)` },
        formattedAddress: "123 Broadway St, New York, USA",
        internationalPhoneNumber: "+1 212 555 0199",
      },
    ],
  };
}
