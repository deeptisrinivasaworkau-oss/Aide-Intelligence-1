"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/hero.css";

/**
 * Full-bleed hero: stormy ocean settling into calm, behind the logo, headline
 * and a single call to action.
 *
 * Two decisions worth knowing about, both driven by the footage itself:
 *
 * 1. The clip does NOT loop. It opens dark and turbulent and ends bright and
 *    still, so looping would hard-cut from calm back to storm — undoing the
 *    thing the video is there to say. It plays once and holds on the calm
 *    final frame.
 *
 * 2. The text does not wait for the calm. The ocean takes ~13s to settle, and
 *    a visitor who can't tell what the site is for that long has usually left.
 *    Copy fades in within the first second and the arc plays out behind it.
 */
export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay can be refused (low power mode, data saver). The poster frame
    // stays up in that case and the copy still animates in.
    void video.play().catch(() => {});

    const onEnded = () => {
      // Freeze on the last frame rather than looping back to the storm.
      video.pause();
      video.currentTime = Math.max(0, video.duration - 0.05);
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  return (
    <section className="cine-hero">
      {/* The poster is this clip's own first frame, so it stands in seamlessly
          until playback starts — no fade needed, and nothing to go wrong if a
          load event fires before React attaches its handlers. */}
      <video
        ref={videoRef}
        className="cine-video"
        src="/hero-ocean.mp4"
        poster="/hero-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Scrim. The clip runs dark then bright, so a single flat wash can't
          hold contrast for both — this is weighted top and bottom. */}
      <div className="cine-scrim" aria-hidden="true" />

      <div className="cine-content">
        <Image
          className="cine-logo"
          src="/aide-logo.png"
          alt="Aide Intelligence"
          width={1300}
          height={260}
          priority
        />
        <h1 className="cine-headline">Know what matters, today.</h1>
        <Link className="cine-cta" href="/login">
          Get Started
        </Link>
      </div>

      <div className="cine-scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
