import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScoreKeeper } from "../pages/score-keeper/score-keeper";

export const Route = createFileRoute("/score-keeper")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ScoreKeeper />
    </div>
  );
}
