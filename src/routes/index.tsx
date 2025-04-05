import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FrontPage } from "../pages/front-page";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <FrontPage />
    </div>
  );
}
