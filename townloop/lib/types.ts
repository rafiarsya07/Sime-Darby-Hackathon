export type UserId = string;

export type Tier = "rent" | "gigs" | "vendors";

export type User = {
  id: UserId;
  name: string;
  /** Street address inside the precinct, e.g. "Jalan Elmina 3/2". */
  street: string;
  precinct: string;
  /** Phase, used for the "same phase" bonus and ranking. */
  phase: string;
  /** Owner or tenant, as verified by SDP PRIME. */
  tenure: "Owner" | "Tenant";
  since: string;
  bio?: string;
};

export type Vendor = {
  id: string;
  name: string;
  /** Local = based inside an SDP township. Outside = accredited contractor from elsewhere. */
  kind: "local" | "outside";
  area: string;
  checks: string[];
  rating: number;
  jobs: number;
  since: string;
};

/** Which line illustration a card uses until real photos arrive. */
export type Art =
  | "washer" | "ladder" | "mower" | "drill" | "tent" | "stroller" | "massager" | "racket" | "blazer"
  | "driveway" | "ev" | "bbq"
  | "lawn" | "cook" | "pet" | "tutor" | "it" | "carwash" | "cleaning"
  | "aircond" | "solar" | "pest" | "plumbing" | "gutter"
  | "other";

export type PriceUnit = "day" | "night" | "hour" | "slot" | "job" | "unit" | "visit" | "set";

export type Listing = {
  id: string;
  tier: Tier;
  /** Resident id for rent and gigs, vendor id for vendors. */
  ownerId: string;
  title: string;
  category: string;
  art: Art;
  price: number;
  unit: PriceUnit;
  deposit?: number;
  /** Pick up window for rent, availability for gigs, lead time for vendors. */
  when: string;
  description: string;
  facility?: boolean;
  free?: boolean;
  /** Vendors: price per household once the street group fills. */
  groupPrice?: number;
  groupTarget?: number;
  recurring?: string;
  rating: number;
  reviews: number;
  done: number;
};

export type PostStatus = "open" | "matched" | "closed";

/** A "wanted" post. Anyone can ask for an item, a service or a vendor. */
export type Post = {
  id: string;
  authorId: UserId;
  tier: Tier;
  title: string;
  details: string;
  budget?: number;
  when: string;
  from: string;
  to: string;
  art: Art;
  status: PostStatus;
  createdAt: string;
};

export type ChatRequestStatus = "pending" | "accepted" | "declined";

/**
 * Nobody can open a chat directly. A provider answering a post, or a resident
 * booking a listing, sends a request. Only when the other side accepts does
 * the WhatsApp introduction fire.
 */
export type ChatRequest = {
  id: string;
  kind: "post" | "booking";
  postId?: string;
  bookingId?: string;
  fromId: string;
  toId: UserId;
  message: string;
  offer?: number;
  status: ChatRequestStatus;
  createdAt: string;
};

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in_use" // rent only, between QR pick up and QR return
  | "done" // returned or job finished; the 24 hour window is running
  | "closed" // window passed, points paid
  | "declined";

export type Booking = {
  id: string;
  tier: Tier;
  listingId?: string;
  postId?: string;
  title: string;
  art: Art;
  providerId: string;
  providerKind: "resident" | "vendor";
  customerId: UserId;
  from: string;
  to: string;
  time?: string;
  total: number;
  deposit?: number;
  code: string;
  group?: boolean;
  recurring?: boolean;
  free?: boolean;
  facility?: boolean;
  onTime?: boolean;
  status: BookingStatus;
  events: { status: BookingStatus; at: string }[];
};

export type GroupBuy = {
  id: string;
  listingId: string;
  street: string;
  joined: UserId[];
  target: number;
  date: string;
};

export type Review = { id: string; aboutId: string; byId: UserId; stars: number; text: string; at: string; title: string };

export type PointsEntry = { id: string; userId: UserId; amount: number; label: string; at: string; bookingId?: string };

export type Reward = { id: string; title: string; place: string; cost: number };

export type Redemption = { id: string; userId: UserId; rewardId: string; code: string; at: string };

export type DemoState = {
  userId: UserId | null;
  listings: Listing[];
  posts: Post[];
  requests: ChatRequest[];
  bookings: Booking[];
  groups: GroupBuy[];
  reviews: Review[];
  points: PointsEntry[];
  redemptions: Redemption[];
  saved: string[];
};
