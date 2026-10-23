import type { Art } from "./types";

/**
 * Demo photos from Unsplash (free Unsplash License, no Unsplash+ images).
 * Served straight from the Unsplash CDN, which resizes them for us.
 */
const ART_PHOTOS: Partial<Record<Art, string>> = {
  washer: "1782235869457-069673be2dc3",
  ladder: "1756412066515-57365695acf8",
  mower: "1458245201577-fc8a130b8829",
  drill: "1572981779307-38b8cabb2407",
  tent: "1595972426725-f728e955b148",
  stroller: "1559135141-2bea6465fccf",
  massager: "1675159364615-38e1f6b62282",
  racket: "1708312604109-16c0be9326cd",
  blazer: "1740710748146-a15d840d6f40",
  driveway: "1762117360928-1548ff7ab5a2",
  ev: "1766507680004-1c71007aefe5",
  bbq: "1785021031353-924b1e08bf17",
  lawn: "1689728318937-17d24bc0a65c",
  cook: "1677921755291-c39158477b8e",
  pet: "1529778873920-4da4926a72c2",
  tutor: "1509228468518-180dd4864904",
  it: "1721333089073-215a56fd710c",
  carwash: "1781890381002-8cdb499b406a",
  cleaning: "1758273238415-01ec03d9ef27",
  aircond: "1762341123870-d706f257a12e",
  solar: "1754619880959-2b0528375883",
  pest: "1747659629851-a92bd71149f6",
  plumbing: "1749532125405-70950966b0e5",
  gutter: "1634853982486-c06f0e17940f",
};

/** Portraits by person or vendor id. */
const PEOPLE: Record<string, string> = {
  siti: "1550546094-9835463f9f71",
  tan: "1624803642337-2639de804c57",
  rahman: "1535213679542-f42b6f164647",
  farid: "1611403119860-57c4937ef987",
  hocklee: "1701980889802-55ff39e2e973",
  meiling: "1634552516330-ab1ccc0f605e",
  priya: "1628477116196-48afe0d209e0",
  aiman: "1544168190-79c17527004f",
  sdp: "1708957351881-10c3e877da56",
  coolbreeze: "1677938438599-a55528c41b2c",
  sunwash: "1719848576338-9516ba7ccd8b",
  gutterpro: "1785632944232-2857a948dd8f",
  pestaway: "1747659629851-a92bd71149f6",
  fixright: "1749532125405-70950966b0e5",
};

const NAME_TO_ID: Record<string, string> = {
  Siti: "siti", Tan: "tan", "Pak Rahman": "rahman", Farid: "farid", "Hock Lee": "hocklee", "Mei Ling": "meiling",
  Priya: "priya", Aiman: "aiman", "SDP Community": "sdp", "CoolBreeze Aircond": "coolbreeze", "SunWash Solar Care": "sunwash",
  GutterPro: "gutterpro", PestAway: "pestaway", "FixRight Plumbing": "fixright",
};

const url = (id: string, w: number, h: number, faces = false) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70${faces ? "&crop=faces" : ""}`;

export function artPhoto(art: Art, w = 800, h = 600) {
  const id = ART_PHOTOS[art];
  return id ? url(id, w, h) : null;
}

export function personPhoto(idOrName: string, size = 160) {
  const id = PEOPLE[idOrName] ?? PEOPLE[NAME_TO_ID[idOrName] ?? ""];
  return id ? url(id, size, size, true) : null;
}

/** Wide township photo for profile covers. */
export function coverPhoto(w = 900, h = 360) {
  return url("1708957351881-10c3e877da56", w, h);
}
