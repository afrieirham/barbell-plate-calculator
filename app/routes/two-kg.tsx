import type { Route } from "./+types/two-kg";
import { Calculator } from "../components/Calculator";
import { BARBELL_2KG_DEFAULTS } from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barbell Plate Calculator - 2kg Barbell" },
    {
      name: "description",
      content: "Calculate how to load a 2kg barbell to reach your target weight.",
    },
    { name: "apple-mobile-web-app-title", content: "barbell 2kg" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "manifest", href: "/manifest-2kg.webmanifest" },
];

export default function TwoKg() {
  return <Calculator defaults={BARBELL_2KG_DEFAULTS} />;
}
