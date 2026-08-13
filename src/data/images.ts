// Curated Unsplash photography (all images.unsplash.com — free Unsplash License).
// Helper builds a right-sized, cropped, auto-format URL per use case.

const base = (id: string) => `https://images.unsplash.com/${id}`;

export function img(id: string, width: number, height?: number) {
  const h = height ? `&h=${height}` : "";
  return `${base(id)}?q=80&w=${width}${h}&auto=format&fit=crop`;
}

export const IMAGES = {
  heroBrick: "photo-1699805329969-0bb7b82102d6", // tall brick building, clock
  manifestoBrick: "photo-1648130062497-cd75a622a0c9", // wooden table, brick wall
  buildingDome: "photo-1690248560475-7b239a984f76", // glass dome ceiling, architecture
  buildingExterior: "photo-1583058778521-6722c3b87f4c", // concrete building, blue sky
  buildingDetail1: "photo-1550309533-b1f8d1ff6112", // desk globe near window
  buildingDetail2: "photo-1778983246079-f6b5c78fd13d", // blue door, brick building
  buildingDetail3: "photo-1643500517656-f10c425c1307", // brick building, windows, clock
  spaceConcourse: "photo-1702047149248-a6049168d2a8", // group at desks with laptops
  spacePlatform: "photo-1780404197319-14f7b0d63697", // long wooden counter, cafe gathering
  spaceGates: "photo-1605543667606-52b0f1ee1b72", // wooden seat, black/white wall
  spaceStudios: "photo-1720139290958-d8676702c3ed", // empty office, long table
  spaceDepartures: "photo-1431540015161-0bf868a2d407", // oval conference table
  gallery1: "photo-1637580681839-6e3ed197ca93", // laptop on wooden table
  gallery2: "photo-1650387237954-a9c0d10d2a62", // potted plants, wooden table
  gallery5: "photo-1558274803-5addf237d6dd", // vacant orange chairs
  gallery6: "photo-1573219082531-141f9c2fbce9", // black lockers, texture
  locationSkyline: "photo-1610741686854-5948cd981569", // city skyline, blue sky
  ctaStation: "photo-1553184257-604db3e574a8", // train station, daytime
} as const;
