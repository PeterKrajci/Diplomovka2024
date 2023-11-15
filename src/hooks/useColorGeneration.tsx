import { useEffect, useMemo, useState } from "react";
import tinycolor from "tinycolor2";

type Props = {
  defaultNumberOfColors: number;
};

type RGBAColor = {
  r: number; // Red component (0-255)
  g: number; // Green component (0-255)
  b: number; // Blue component (0-255)
  a: number; // Alpha component (0-1, where 0 is fully transparent and 1 is fully opaque)
};

export const useColorGeneration = ({ defaultNumberOfColors }: Props) => {
  const [currentColorsNumber, setCurrentColorsNumber] = useState<number>(
    defaultNumberOfColors
  );
  const [currentColors, setCurrentColors] = useState<RGBAColor[]>([]);

  useEffect(() => {
    const colors: RGBAColor[] = [];
    for (let i = 0; i < currentColorsNumber; i++) {
      const hue = (i * 1080) / currentColorsNumber;
      const saturation = 80 + Math.random() * 20; // Adjust saturation for better distinction
      const lightness = 50 + Math.random() * 10; // Adjust lightness for better distinction

      const rgbColor = tinycolor({
        h: hue,
        s: saturation,
        l: lightness,
      }).toRgb();

      colors.push(rgbColor);
    }

    setCurrentColors(colors);
  }, [currentColorsNumber]);

  return useMemo(
    () => ({
      currentColors,
      currentColorsNumber,
      setCurrentColorsNumber,
    }),
    [currentColors, currentColorsNumber, setCurrentColorsNumber]
  );
};
