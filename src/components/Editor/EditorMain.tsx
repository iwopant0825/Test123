import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { ModelContext } from "../../contexts/ModelContext";
import ModelLoader from "./ModelLoader";
import type { ModelDetails } from "./ModelLoader";
import LoaderOverlay from "./LoaderOverlay";
import type React from "react";

const Container = styled.section`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Side = styled.aside`
  width: 260px;
  min-width: 220px;
  max-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #2a2b2e;
`;

const LeftSide = styled(Side)<{ $widthPx: number }>`
  width: ${(p) => p.$widthPx}px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
`;

const RightSide = styled(Side)<{ $widthPx: number }>`
  width: ${(p) => p.$widthPx}px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const PanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.9;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const ToolGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 4px;
`;

const IconBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const Icon = styled.span`
  font-family: "Material Symbols Outlined";
  font-size: 18px;
  line-height: 1;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
`;

const PanelBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px 12px;
`;

const Tree = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TreeRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const RowLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const RowRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const RowText = styled.span`
  font-size: 13px;
`;

const Viewport = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  /* 캔버스 배경은 기본값 사용 */
`;

const ResizeHandleRight = styled.div`
  position: absolute;
  top: 0;
  right: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
`;

const ResizeHandleLeft = styled.div`
  position: absolute;
  top: 0;
  left: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
`;

const FooterBar = styled.button`
  all: unset;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;
// 제거된 컴포넌트 자리 정리

function EditorMain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(260);
  const dragSide = useRef<null | "left" | "right">(null);
  const { model } = useContext(ModelContext);
  const [details, setDetails] = useState<ModelDetails | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragSide.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const MIN_SIDE = 180;
      const MIN_VIEWPORT = 480;

      if (dragSide.current === "left") {
        let next = e.clientX - rect.left;
        const max = Math.max(MIN_SIDE, rect.width - rightWidth - MIN_VIEWPORT);
        next = Math.max(MIN_SIDE, Math.min(next, max));
        setLeftWidth(next);
      } else if (dragSide.current === "right") {
        let next = rect.right - e.clientX;
        const max = Math.max(MIN_SIDE, rect.width - leftWidth - MIN_VIEWPORT);
        next = Math.max(MIN_SIDE, Math.min(next, max));
        setRightWidth(next);
      }
    }

    function onUp() {
      dragSide.current = null;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [leftWidth, rightWidth]);

  const startLeftDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragSide.current = "left";
  };

  const startRightDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragSide.current = "right";
  };

  // no-op state removed

  return (
    <Container ref={containerRef}>
      <LeftSide $widthPx={leftWidth}>
        <PanelHeader>
          <PanelTitle>Meshes</PanelTitle>
          <IconBar>
            <IconButton aria-label="정렬">
              <Icon className="material-symbols-outlined">sort</Icon>
            </IconButton>
            <IconButton aria-label="리스트">
              <Icon className="material-symbols-outlined">
                format_list_bulleted
              </Icon>
            </IconButton>
            <IconButton aria-label="필터">
              <Icon className="material-symbols-outlined">filter_list</Icon>
            </IconButton>
          </IconBar>
        </PanelHeader>
        <Toolbar>
          <ToolGroup>
            <IconButton title="리스트 보기">
              <Icon className="material-symbols-outlined">view_list</Icon>
            </IconButton>
            <IconButton title="계층 보기">
              <Icon className="material-symbols-outlined">account_tree</Icon>
            </IconButton>
          </ToolGroup>
          <Divider />
          <ToolGroup>
            <IconButton title="정렬 위">
              <Icon className="material-symbols-outlined">expand_less</Icon>
            </IconButton>
            <IconButton title="정렬 아래">
              <Icon className="material-symbols-outlined">expand_more</Icon>
            </IconButton>
          </ToolGroup>
          <Divider />
          <ToolGroup>
            <IconButton title="모두 맞춤">
              <Icon className="material-symbols-outlined">fullscreen</Icon>
            </IconButton>
            <IconButton title="선택 맞춤">
              <Icon className="material-symbols-outlined">fit_screen</Icon>
            </IconButton>
            <IconButton title="표시/숨김">
              <Icon className="material-symbols-outlined">visibility</Icon>
            </IconButton>
          </ToolGroup>
        </Toolbar>
        <PanelBody>
          <Tree>
            <TreeRow>
              <RowLeft>
                <Icon className="material-symbols-outlined">expand_more</Icon>
                <Icon className="material-symbols-outlined">inventory_2</Icon>
                <RowText>AS1_PE_ASM</RowText>
              </RowLeft>
              <RowRight>
                <IconButton title="맞춤">
                  <Icon className="material-symbols-outlined">fit_screen</Icon>
                </IconButton>
                <IconButton title="보이기/숨기기">
                  <Icon className="material-symbols-outlined">visibility</Icon>
                </IconButton>
              </RowRight>
            </TreeRow>
            <TreeRow>
              <RowLeft style={{ paddingLeft: 18 }}>
                <Icon className="material-symbols-outlined">
                  fiber_manual_record
                </Icon>
                <RowText>No Name</RowText>
              </RowLeft>
              <RowRight>
                <IconButton title="맞춤">
                  <Icon className="material-symbols-outlined">fit_screen</Icon>
                </IconButton>
                <IconButton title="보이기/숨기기">
                  <Icon className="material-symbols-outlined">visibility</Icon>
                </IconButton>
              </RowRight>
            </TreeRow>
          </Tree>
        </PanelBody>
        <ResizeHandleRight onMouseDown={startLeftDrag} />
        <FooterBar>
          <RowLeft>
            <RowText>Materials (1)</RowText>
          </RowLeft>
          <Icon className="material-symbols-outlined">chevron_right</Icon>
        </FooterBar>
      </LeftSide>

      <Viewport>
        <Canvas
          camera={{ position: [3, 3, 6], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={<LoaderOverlay />}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            {model.url ? null : (
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial color={"#7ce3ff"} />
              </mesh>
            )}
            {model.url && (
              <ModelLoader
                url={model.url!}
                ext={(model.ext || "").toLowerCase()}
                onLoaded={(info) => setDetails(info)}
              />
            )}
            <Environment preset="city" />
            <OrbitControls enableDamping />
          </Suspense>
        </Canvas>
      </Viewport>

      <RightSide $widthPx={rightWidth}>
        <PanelHeader>
          <PanelTitle>Details</PanelTitle>
          <IconBar>
            <IconButton aria-label="정보">
              <Icon className="material-symbols-outlined">info</Icon>
            </IconButton>
          </IconBar>
        </PanelHeader>
        <PanelBody>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: 10,
              columnGap: 12,
            }}
          >
            <dt>Vertices:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>
              {details?.vertices?.toLocaleString() ?? "-"}
            </dd>
            <dt>Triangles:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>
              {details?.triangles?.toLocaleString() ?? "-"}
            </dd>
            <dt>Unit:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>Unitless</dd>
            <dt>Size X:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>
              {details ? details.sizeX.toFixed(2) : "-"}
            </dd>
            <dt>Size Y:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>
              {details ? details.sizeY.toFixed(2) : "-"}
            </dd>
            <dt>Size Z:</dt>
            <dd style={{ textAlign: "right", opacity: 0.85 }}>
              {details ? details.sizeZ.toFixed(2) : "-"}
            </dd>
          </dl>
        </PanelBody>
        <ResizeHandleLeft onMouseDown={startRightDrag} />
      </RightSide>
    </Container>
  );
}

export default EditorMain;
