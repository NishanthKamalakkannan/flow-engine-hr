import { BaseEdge, getSmoothStepPath } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflowStore";

/**
 * Custom animated edge with a smooth step path and a flowing animation dot.
 * Updated to react to the simulation 'traversal' path.
 */
export default function AnimatedEdge({
  id,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: any) {
  const activeSimulationNodeId = useWorkflowStore((s: any) => s.activeSimulationNodeId);
  const isTargetActive = activeSimulationNodeId === target;

  // We consider an edge "traversed" if the source is active or has been active
  // For simplicity during live trace, we highlight edges leading TO the active node
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const activeColor = "#10B981"; // Emerald Green
  const baseColor = "#FFCCD5";   // Soft Rose Pink

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: isTargetActive ? activeColor : baseColor,
          strokeWidth: isTargetActive ? 4 : 2,
          strokeOpacity: isTargetActive ? 1 : 0.6,
          transition: "all 0.5s ease",
        }}
      />
      
      {/* Animated flowing dot */}
      <circle r={isTargetActive ? "4" : "3"} fill={isTargetActive ? activeColor : baseColor} filter={`url(#glow-${id})`}>
        <animateMotion 
          dur={isTargetActive ? "0.8s" : "2s"} 
          repeatCount="indefinite" 
          path={edgePath} 
        />
      </circle>

      {/* Glow filter for the dot */}
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isTargetActive ? "3" : "2"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </>
  );
}
