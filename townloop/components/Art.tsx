import type { ComponentType } from "react";
import type { Art } from "@/lib/types";
import { artPhoto } from "@/lib/photos";
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

/** Square thumbnail: the listing photo, or the line illustration when there is none. */
export function ArtTile({ art, size = 56, className = "" }: { art: Art; size?: number; className?: string }) {
  const src = artPhoto(art, size * 2, size * 2);
  return (
    <span style={{ width: size, height: size }} className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-surface text-ink ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <ArtIcon art={art} size={Math.round(size / 2)} />
      )}
    </span>
  );
}

/** Large photo that fills its parent. Falls back to the illustration. */
export function ArtPhoto({ art, w = 800, h = 600, alt = "", iconSize = 96, eager = false }: { art: Art; w?: number; h?: number; alt?: string; iconSize?: number; eager?: boolean }) {
  const src = artPhoto(art, w, h);
  if (!src) {
    return (
      <span className="absolute inset-0 flex items-center justify-center bg-surface text-ink">
        <ArtIcon art={art} size={iconSize} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className="absolute inset-0 size-full bg-surface object-cover" />;
}
