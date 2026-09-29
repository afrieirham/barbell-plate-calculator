import type { Route } from "./+types/home";
import { Calculator } from "../components/Calculator";
import { HOME_DEFAULTS } from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barbell Plate Calculator" },
    {
      name: "description",
      content: "Calculate how to load a barbell to reach your target weight.",
    },
    { name: "apple-mobile-web-app-title", content: "barbell" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "manifest", href: "/manifest.webmanifest" },
];

export default function Home() {
  return <Calculator defaults={HOME_DEFAULTS} />;
}
