import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Rules } from "../pages/rules";

export const Route = createFileRoute("/rules")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Rules/>
    </div>
  );
}
