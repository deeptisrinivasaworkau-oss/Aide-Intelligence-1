"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/hero.css";

/**
 * Full-bleed hero: sunlight moving across open water, with the brand mark,
 * headline and a single call to action over it.
 *
 * The footage is high-contrast — near-black water carrying near-white
 * specular highlights — so the copy sits on a scrim rather than directly on
 * the video. Without it the headline would break up wherever a sparkle
 * crossed a letterform.
 */
export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Autoplay may be refused (low power mode, data saver); the poster frame
    // covers that case and the copy still animates in.
    void video.play().catch(() => {});
  }, []);

  return (
    <section className="cine-hero">
      <video
        ref={videoRef}
        className="cine-video"
        src="/hero-water.mp4"
        poster="/hero-poster.jpg"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="cine-scrim" aria-hidden="true" />

      <div className="cine-content">
        <Image
          className="cine-mark"
          src="/aide-mark.png"
          alt="Aide Intelligence"
          width={240}
          height={230}
          priority
        />
        <h1 className="cine-headline">
          Know what matters,
          <br />
          <em>when it matters.</em>
        </h1>
        <Link className="cine-cta" href="/try-aide">
          Get Started
        </Link>
      </div>

      <a className="cine-scroll" href="#integrations" aria-label="Scroll to content">
        <span className="cine-scroll-mouse">
          <span className="cine-scroll-wheel" />
        </span>
      </a>
    </section>
  );
}
