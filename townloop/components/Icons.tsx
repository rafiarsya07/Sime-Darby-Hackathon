import type { ReactNode, SVGProps } from "react";

/**
 * TownLoop custom icon set.
 * 24 unit grid, 1.6 stroke, round caps and joins.
 * Feature icons carry one ember detail. Utility icons stay ink only.
 *
 * Usage:  <JetWasherIcon size={28} />   <SearchIcon className="text-slate" />
 * Colour: the stroke follows currentColor, the ember detail follows --ember.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
  /** Accessible name. Leave empty for decorative icons next to a text label. */
  label?: string;
};

const EMBER = "var(--color-ember, #F26B2E)";

function Svg({ size = 24, label, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* Navigation and account */

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11l8-6.5 8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <circle cx="12" cy="15" r="2" fill={EMBER} stroke="none" />
  </Svg>
);

export const PrecinctIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" fill={EMBER} stroke="none" />
  </Svg>
);

export const LoopIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="12" r="5" />
    <circle cx="15" cy="12" r="5" stroke={EMBER} />
  </Svg>
);

export const BookingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5.5" width="16" height="14" rx="3" />
    <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    <circle cx="15.5" cy="15" r="1.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const MessagesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.4-4.3A7.5 7.5 0 1 1 20 12z" />
    <circle cx="12" cy="12" r="1.6" fill={EMBER} stroke="none" />
  </Svg>
);

export const ProfileIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    <circle cx="18" cy="5.5" r="1.8" fill={EMBER} stroke="none" />
  </Svg>
);

/* Tools and spaces (Tier 1) */

export const JetWasherIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="11" width="9" height="8" rx="2" />
    <path d="M6 11V8h4v3" />
    <path d="M12.5 14h3l4-4" />
    <circle cx="20.5" cy="8" r="1.7" fill={EMBER} stroke="none" />
  </Svg>
);

export const LawnmowerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 5l4 9" />
    <path d="M6 14h12.5a2 2 0 0 1 2 2v1H6z" />
    <circle cx="8.5" cy="19.5" r="1.8" />
    <circle cx="17.5" cy="19.5" r="1.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const LadderIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3v18M16 3v18M8 7.5h8M8 16.5h8" />
    <path d="M8 12h8" stroke={EMBER} />
  </Svg>
);

export const DrivewayIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M10 16.5V7.5h3a2.75 2.75 0 0 1 0 5.5h-3" />
    <circle cx="16.5" cy="16.5" r="1.5" fill={EMBER} stroke="none" />
  </Svg>
);

export const EvChargerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3v4M15 3v4" />
    <path d="M7 7h10v3.5a5 5 0 0 1-10 0z" />
    <path d="M12 15.5V21" />
    <circle cx="12" cy="10.5" r="1.6" fill={EMBER} stroke="none" />
  </Svg>
);

/* Neighbour gigs (Tier 2) */

export const LendAHandIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 13.5l3-1 4 3h4a1.5 1.5 0 0 1 0 3h-4" />
    <path d="M3.5 13.5V20h10.5l5.2-4a1.6 1.6 0 0 0-2-2.5L14.5 15" />
    <circle cx="12.5" cy="6.5" r="2.6" fill={EMBER} stroke="none" />
  </Svg>
);

export const PetSittingIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="15.5" rx="4" ry="3.5" />
    <circle cx="6.5" cy="10.5" r="1.6" />
    <circle cx="9.8" cy="6.8" r="1.6" />
    <circle cx="14.2" cy="6.8" r="1.6" fill={EMBER} stroke="none" />
    <circle cx="17.5" cy="10.5" r="1.6" />
  </Svg>
);

export const TutoringIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z" />
    <path d="M12 6.5v13" />
    <path d="M15 9.5h2.5" stroke={EMBER} />
  </Svg>
);

export const ItHelpIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="5.5" width="14" height="9.5" rx="1.5" />
    <path d="M3 18.5h18" />
    <circle cx="12" cy="10.25" r="1.7" fill={EMBER} stroke="none" />
  </Svg>
);

export const HomeCookedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16a8 8 0 0 1-16 0z" />
    <path d="M9 8.5c0-1.2 1-1.6 1-3M14 8.5c0-1.2 1-1.6 1-3" />
    <circle cx="12" cy="15.5" r="1.6" fill={EMBER} stroke="none" />
  </Svg>
);

/* Vetted services (Tier 3) */

export const AircondIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="8" rx="2.5" />
    <path d="M6.5 10h11" />
    <path d="M8 16.5c0 1.5-1 1.5-1 3M12 16.5v3M16 16.5c0 1.5 1 1.5 1 3" />
    <circle cx="17.5" cy="7.6" r="1.1" fill={EMBER} stroke="none" />
  </Svg>
);

export const SolarCleanIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10h16l-2 9H6z" />
    <path d="M8.7 10L8 19M15.3 10l.7 9M5 14.5h14" />
    <circle cx="12" cy="5" r="2" fill={EMBER} stroke="none" />
  </Svg>
);

export const GroupBuyIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
    <path d="M15.5 5.3a3 3 0 0 1 0 5.4M17.5 14.8c1.6.6 2.7 2 3 4.2" stroke={EMBER} />
  </Svg>
);

/* Trust and handover */

export const QrHandoverIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
    <circle cx="17" cy="17" r="2.2" fill={EMBER} stroke="none" />
  </Svg>
);

export const VerifiedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z" />
    <path d="M9 12l2 2 4-4.5" stroke={EMBER} />
  </Svg>
);

export const DepositIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15.5" r="1.7" fill={EMBER} stroke="none" />
  </Svg>
);

/* Eco-Points (Tier 4) */

export const EcoPointsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 15.5c0-4 3-7 7-7 0 4-3 7-7 7zM8.5 15.5l3.5-3.5" stroke={EMBER} />
  </Svg>
);

export const VoucherIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z" />
    <path d="M14.5 6.5v11" strokeDasharray="1.5 2.5" />
    <circle cx="9" cy="12" r="1.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const AlertsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
    <circle cx="17.8" cy="5.5" r="2.2" fill={EMBER} stroke="none" />
  </Svg>
);

/* Utility, ink only */

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5.5L8.5 12l6.5 6.5" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Svg>
);

export const AddIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const ScanIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10" />
  </Svg>
);

export const FilterIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Svg>
);

/* Brand mark: two linked rings. Pass the background colour so the overlap break matches. */
export function TownLoopMark({ size = 40, background = "var(--color-paper, #FFFFFF)", label = "TownLoop" }: { size?: number; background?: string; label?: string }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 120 80" role="img" aria-label={label}>
      <circle cx="40" cy="40" r="25" fill="none" stroke="var(--color-ink, #1A1A1A)" strokeWidth="11" />
      <circle cx="80" cy="40" r="25" fill="none" stroke={EMBER} strokeWidth="11" />
      <path d="M64 48.5 A25 25 0 0 1 53 61.5" fill="none" stroke={background} strokeWidth="20" />
      <path d="M64 48.5 A25 25 0 0 1 53 61.5" fill="none" stroke="var(--color-ink, #1A1A1A)" strokeWidth="11" />
    </svg>
  );
}

/* Extra glyphs for the web app */

export const DrillIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 8.5h10a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-10z" />
    <path d="M15.5 11h4" />
    <path d="M7 13.5l-1 6h3.5l1-6" />
    <circle cx="20.8" cy="11" r="1.4" fill={EMBER} stroke="none" />
  </Svg>
);

export const BbqIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 10.5h15a7.5 6 0 0 1-15 0z" />
    <path d="M9 16.5L7 21M15 16.5l2 4.5" />
    <path d="M9 7.5c0-1.2 1-1.6 1-3M14 7.5c0-1.2 1-1.6 1-3" />
    <circle cx="12" cy="13" r="1.5" fill={EMBER} stroke="none" />
  </Svg>
);

export const CarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 16.5V12l2-5h10l2 5v4.5" />
    <path d="M4 16.5h16v2.5H4z" />
    <circle cx="8" cy="13.5" r="1" />
    <circle cx="16" cy="13.5" r="1" fill={EMBER} stroke="none" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const CameraIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="3" />
    <circle cx="12" cy="13.5" r="3.5" />
    <path d="M8.5 7l1.5-3h4l1.5 3" />
  </Svg>
);

/* Tier 1, 2 and 3 additions */

export const TentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 9.5L12 4l9.5 5.5z" />
    <path d="M5 9.5V20M19 9.5V20" />
    <path d="M8.5 15h7M10 15v5M14 15v5" />
    <circle cx="12" cy="7.4" r="1.2" fill={EMBER} stroke="none" />
  </Svg>
);

export const StrollerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h11a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4z" />
    <path d="M10 12V5a7 7 0 0 1 6.5 7" />
    <path d="M16 12l2-5h2.5" />
    <circle cx="8" cy="19.5" r="1.6" />
    <circle cx="14.5" cy="19.5" r="1.6" fill={EMBER} stroke="none" />
  </Svg>
);

export const MassagerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15h11a2.5 2.5 0 0 1 2.5 2.5V19H4z" />
    <path d="M7 10c1-1.5 2-1.5 3 0s2 1.5 3 0 2-1.5 3 0" />
    <path d="M7 6.5c1-1.5 2-1.5 3 0s2 1.5 3 0 2-1.5 3 0" />
    <circle cx="16.5" cy="17" r="1.1" fill={EMBER} stroke="none" />
  </Svg>
);

export const RacketIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="9" r="5.5" />
    <path d="M5.5 9h7M9 5.5v7" />
    <path d="M13 13l7 7" />
    <circle cx="19" cy="5" r="1.7" fill={EMBER} stroke="none" />
  </Svg>
);

export const BlazerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3.5L4.5 6v14.5h15V6L16 3.5" />
    <path d="M8 3.5l4 6 4-6" />
    <path d="M12 9.5v11" />
    <circle cx="13.6" cy="14" r="1.1" fill={EMBER} stroke="none" />
  </Svg>
);

export const GrassIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 20h18" />
    <path d="M6 20c0-4 1-6 3-8M10.5 20c0-5 1-8 3-10M15.5 20c0-3 1-5 3-6" />
    <circle cx="18.5" cy="6" r="1.7" fill={EMBER} stroke="none" />
  </Svg>
);

export const CarWashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 18v-3.5l2-4.5h11l2 4.5V18z" />
    <path d="M4.5 18v2M19.5 18v2" />
    <circle cx="8" cy="15" r="0.9" />
    <circle cx="16" cy="15" r="0.9" />
    <path d="M12 3c0 1.2-1.3 1.8-1.3 3a1.3 1.3 0 0 0 2.6 0c0-1.2-1.3-1.8-1.3-3z" fill={EMBER} stroke="none" />
  </Svg>
);

export const SprayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 10h6v10.5H8z" />
    <path d="M9 10V6.5h4l2.5 1.5" />
    <path d="M13 6.5V5" />
    <circle cx="19" cy="6" r="1" fill={EMBER} stroke="none" />
    <circle cx="19.5" cy="9" r="0.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const BugIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="14" rx="4" ry="5.5" />
    <circle cx="12" cy="6.5" r="2" fill={EMBER} stroke="none" />
    <path d="M8 11.5H4.5M8 15H4M8.5 18.5l-3 2M16 11.5h3.5M16 15h4M15.5 18.5l3 2" />
  </Svg>
);

export const WrenchIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z" />
    <circle cx="18.5" cy="18.5" r="1.5" fill={EMBER} stroke="none" />
  </Svg>
);

export const GutterIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11l9-6.5 9 6.5" />
    <path d="M3 11h18v1.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 12.5z" />
    <path d="M18 14v6" />
    <circle cx="13" cy="17.5" r="1.1" fill={EMBER} stroke="none" />
  </Svg>
);

export const PostIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4.5" width="16" height="15" rx="1.5" />
    <path d="M8 10h8M8 14h5" />
    <circle cx="12" cy="4.5" r="1.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Svg {...p}>
    <path d="M12 19.5s-7-4.3-7-9.5a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.2-7 9.5-7 9.5z" fill={filled ? EMBER : "none"} stroke={filled ? EMBER : "currentColor"} />
  </Svg>
);

export const ForecastIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4v16h16" />
    <path d="M7 15l4-4 3 3 5-6" />
    <circle cx="19" cy="8" r="1.6" fill={EMBER} stroke="none" />
  </Svg>
);

export const ShopIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5l1.5-5h13L20 9.5" />
    <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
    <path d="M5.5 12v8h13v-8" />
    <path d="M10 20v-4.5h4V20" />
    <circle cx="13.1" cy="17.8" r="0.8" fill={EMBER} stroke="none" />
  </Svg>
);

export const LockedChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.4-4.3A7.5 7.5 0 1 1 20 12z" />
    <path d="M10 12.5h4v3h-4z" />
    <path d="M10.8 12.5v-1a1.2 1.2 0 0 1 2.4 0v1" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" fill={EMBER} stroke={EMBER} />
  </Svg>
);

export const ShareIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 15V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M6 11.5H5.5A1.5 1.5 0 0 0 4 13v5.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V13a1.5 1.5 0 0 0-1.5-1.5H18" />
  </Svg>
);
