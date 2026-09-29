import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("10kg", "routes/ten-kg.tsx"),
  route("2kg", "routes/two-kg.tsx"),
] satisfies RouteConfig;
