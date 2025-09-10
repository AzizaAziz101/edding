import { LenisProvider } from "./components/LenisProvider";
import { ImageRevealScroll } from "./components/RevealScroll";

export default function Page() {
  return (
    <LenisProvider>
      <div className="h-full w-full">
        <div className="my-20 grid content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40">
            Scroll down to reveal the images
          </span>
        </div>
        <ImageRevealScroll />
      </div>
    </LenisProvider>
  );
}
