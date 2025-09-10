import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    token: undefined!,
  },
})

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string;
    isDisabled?: boolean;
  }
  interface Register {
    router: typeof router;
  }
}

export default router;