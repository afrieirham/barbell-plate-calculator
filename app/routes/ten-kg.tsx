import type { Route } from "./+types/ten-kg";
import { Calculator } from "../components/Calculator";
import { BARBELL_10KG_DEFAULTS } from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barbell Plate Calculator - 10kg Barbell" },
    {
      name: "description",
      content: "Calculate how to load a 10kg barbell to reach your target weight.",
    },
    { name: "apple-mobile-web-app-title", content: "barbell 10kg" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "manifest", href: "/manifest-10kg.webmanifest" },
];

export default function TenKg() {
  return <Calculator defaults={BARBELL_10KG_DEFAULTS} />;
}
