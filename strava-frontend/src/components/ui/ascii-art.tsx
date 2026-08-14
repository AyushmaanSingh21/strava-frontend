// AsciiArt — "qweqw", made with the 21st ASCII editor and baked to its exact
// rendered output (looping video + poster). Zero dependencies: one <video>
// that fills its parent. Drop it behind or inside your content:
//   <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
//   https://21st.dev/community/ascii/editor?from=43220377-d42a-491f-9825-84b53c4997c2
export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_3HgdEeKGCVNhWWoCeJ53q1fDQCD/d10d3128-eb57-4c90-af3c-cd3a2ad651ec.mp4"
      poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_3HgdEeKGCVNhWWoCeJ53q1fDQCD/bf6f766e-747f-46dd-af14-6390b7eae845.webp"
      autoPlay
      loop
      muted
      playsInline
      aria-label="qweqw — animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}
