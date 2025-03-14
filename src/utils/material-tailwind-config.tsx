import { ThemeProvider } from "@material-tailwind/react";
import React from "react";

export function MaterialTailwindProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
