import { useEffect, useMemo, useState } from "react";
import tinycolor from "tinycolor2";

type Props = {
  defaultNumberOfColors: number;
};

type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const useColorGeneration = ({ defaultNumberOfColors }: Props) => {
  const [currentColors, setCurrentColors] = useState<RGBAColor[]>([]);

  useEffect(() => {
    const colors: RGBAColor[] = [];
    for (let i = 0; i < defaultNumberOfColors; i++) {
      // Evenly distribute hues around the color wheel
      const hue = (i * 550) / defaultNumberOfColors;
      // Keep saturation and lightness values consistent for all colors
      const saturation = 80; // High saturation for vivid colors
      const lightness = 50; // Mid-range lightness for brightness without being too light or too dark

      const rgbColor = tinycolor(
        `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ).toRgb();
      colors.push(rgbColor);
    }

    setCurrentColors(colors);
  }, [defaultNumberOfColors]);

  return useMemo(
    () => ({
      currentColors,
    }),
    [currentColors]
  );
};
