import { BaseEdge, getSmoothStepPath } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflowStore";

/**
 * Custom animated edge with a smooth step path and a flowing animation dot.
 * Updated for Cosmic Mission Control: Cyan data streams on a dark void.
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

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const activeColor = "#10B981"; // Emerald Success
  const baseColor = "#06B6D4";   // Cyan Data Stream

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: isTargetActive ? activeColor : baseColor,
          strokeWidth: isTargetActive ? 4 : 2,
          strokeOpacity: isTargetActive ? 1 : 0.25,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      
      {/* Animated flowing data packet */}
      <circle 
        r={isTargetActive ? "4" : "2.5"} 
        fill={isTargetActive ? activeColor : baseColor} 
        filter={`url(#glow-${id})`}
        style={{ opacity: isTargetActive ? 1 : 0.6 }}
      >
        <animateMotion 
          dur={isTargetActive ? "0.6s" : "3s"} 
          repeatCount="indefinite" 
          path={edgePath} 
        />
      </circle>

      {/* Glow filter for the mission-critical signal */}
      <defs>
        <filter id={`glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={isTargetActive ? "4" : "2"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </>
  );
}
