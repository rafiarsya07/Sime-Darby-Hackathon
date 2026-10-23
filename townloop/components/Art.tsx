import type { ComponentType } from "react";
import type { Art } from "@/lib/types";
import {
  AircondIcon, BbqIcon, BlazerIcon, BugIcon, CarIcon, CarWashIcon, DrillIcon, EvChargerIcon, GrassIcon, GutterIcon,
  HomeCookedIcon, ItHelpIcon, JetWasherIcon, LadderIcon, LawnmowerIcon, LoopIcon, MassagerIcon, PetSittingIcon, RacketIcon,
  SolarCleanIcon, SprayIcon, StrollerIcon, TentIcon, TutoringIcon, WrenchIcon,
} from "./Icons";

const MAP: Record<Art, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  washer: JetWasherIcon, ladder: LadderIcon, mower: LawnmowerIcon, drill: DrillIcon, tent: TentIcon, stroller: StrollerIcon,
  massager: MassagerIcon, racket: RacketIcon, blazer: BlazerIcon, driveway: CarIcon, ev: EvChargerIcon, bbq: BbqIcon,
  lawn: GrassIcon, cook: HomeCookedIcon, pet: PetSittingIcon, tutor: TutoringIcon, it: ItHelpIcon, carwash: CarWashIcon,
  cleaning: SprayIcon, aircond: AircondIcon, solar: SolarCleanIcon, pest: BugIcon, plumbing: WrenchIcon, gutter: GutterIcon,
  other: LoopIcon,
};

export function ArtIcon({ art, size = 28 }: { art: Art; size?: number }) {
  const Icon = MAP[art] ?? LoopIcon;
  return <Icon size={size} strokeWidth={size > 48 ? 1.2 : 1.6} />;
}

/** Illustration tile standing in for the listing photo. */
export function ArtTile({ art, size = 56, className = "" }: { art: Art; size?: number; className?: string }) {
  return (
    <span style={{ width: size, height: size }} className={`flex shrink-0 items-center justify-center rounded-[10px] bg-surface text-ink ${className}`}>
      <ArtIcon art={art} size={Math.round(size / 2)} />
    </span>
  );
}
