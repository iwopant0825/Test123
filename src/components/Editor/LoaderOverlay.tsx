import { Html, useProgress } from "@react-three/drei";
import styled from "styled-components";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #eaf6ff;
  min-width: 160px;
`;

const BarWrap = styled.div`
  width: 200px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
`;

const Bar = styled.div<{ $w: number }>`
  height: 100%;
  width: ${(p) => p.$w}%;
  background: #7ce3ff;
  transition: width 0.2s ease;
`;

export default function LoaderOverlay() {
  const { progress } = useProgress();
  const pct = Math.round(progress);
  return (
    <Html center>
      <Box>
        <div>Loading… {pct}%</div>
        <BarWrap>
          <Bar $w={pct} />
        </BarWrap>
      </Box>
    </Html>
  );
}
