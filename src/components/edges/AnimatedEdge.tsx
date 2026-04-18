import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

/**
 * Custom animated edge with a smooth step path and a flowing animation dot.
 * Demonstrates React Flow edge customization mastery.
 */
export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: any) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: "#F97316",
          strokeWidth: 2,
          strokeOpacity: 0.6,
        }}
      />
      {/* Animated flowing dot */}
      <circle r="3" fill="#F97316" filter="url(#glow)">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      {/* Glow filter for the dot */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </>
  );
}
