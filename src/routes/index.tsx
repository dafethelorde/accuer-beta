import { createFileRoute } from "@tanstack/react-router";

import { AccuerPage } from "@/components/accuer/accuer-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accuer — Private Beta for Tokenized Asset Routing" },
      {
        name: "description",
        content: "Explore Accuer’s invite-only preview for agentic, quantum-resistant routing of tokenized assets. Simulations only; no transactions or funds.",
      },
      { property: "og:title", content: "Accuer — Private Beta for Tokenized Asset Routing" },
      {
        property: "og:description",
        content: "A more thoughtful route through tokenized markets. Join the Accuer invite-only preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccuerPage,
});