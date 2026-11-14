export interface DonkiEvent {
  activityID: string;
  startTime: string;
  sourceLocation?: string;
  note?: string;
  instruments?: Array<{ displayName: string }>;
}

export interface DonkiResponse {
  status: "success" | "fallback";
  source: string;
  isLive: boolean;
  events: DonkiEvent[];
  note?: string;
}

export interface ScienceReference {
  id: string;
  dataset: string;
  sourceUrl: string;
  title: string;
  scientificDistinction: string;
  keyFinding: string;
}

export async function fetchDonkiSpaceWeather(): Promise<DonkiResponse> {
  try {
    const res = await fetch("/api/nasa/donki");
    if (!res.ok) throw new Error("DONKI fetch failed");
    return await res.json();
  } catch (error) {
    return {
      status: "fallback",
      source: "Curated NASA DONKI Space Weather Archive",
      isLive: false,
      events: [
        {
          activityID: "2026-FALLBACK-CME-01",
          startTime: "2026-04-12T08:15Z",
          sourceLocation: "Active Region 3615",
          note: "Modeled Coronal Mass Ejection impacting lunar surface with elevated proton flux.",
        },
      ],
    };
  }
}

export async function fetchScienceReferences(): Promise<ScienceReference[]> {
  try {
    const res = await fetch("/api/nasa/science-data");
    if (!res.ok) throw new Error("Science data fetch failed");
    const json = await res.json();
    return json.references || [];
  } catch (error) {
    return [];
  }
}
