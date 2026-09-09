import { Component, type PropsWithChildren } from "react";
import { TrainerSceneFallback } from "./TrainerSceneFallback";
/** A failed deferred download must never interrupt a learning workspace. */
export class SceneBoundary extends Component<
  PropsWithChildren,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <TrainerSceneFallback /> : this.props.children;
  }
}
