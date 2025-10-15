import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useCallback } from "react";
import { ModelContext } from "../../contexts/ModelContext";

const MainSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
`;
const CheckBox = styled.div`
  padding-top: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
const Boxs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  justify-content: center;
  margin-top: 8px;
`;
const Title = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 0.1px solid #fff;
`;

const TitleText = styled.p`
  font-size: 25px;
  margin-top: 30px;
`;
const SectionLabel = styled.p`
  font-size: 20px;
  margin-bottom: 15px;
`;

const FileChip = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  min-width: 100px;
  border: 2px solid #bfe8ff;
  border-radius: 12px;
  color: #bfe8ff;
  background: rgba(191, 232, 255, 0.06);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(191, 232, 255, 0.12);
    transform: translateY(-1px);
  }
`;

// 디버그 버튼 스타일 제거됨

const SUPPORTED_FORMATS = [
  "3dm",
  "3ds",
  "3mf",
  "amf",
  "bim",
  "brep",
  "dae",
  "fbx",
  "fcstd",
  "gltf",
  "ifc",
  "iges",
  "step",
  "stl",
  "obj",
  "off",
  "ply",
  "wrl",
] as const;

function Main() {
  const navigate = useNavigate();
  const { setModel } = useContext(ModelContext);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowed = [
        "3dm",
        "3ds",
        "3mf",
        "amf",
        "bim",
        "brep",
        "dae",
        "fbx",
        "fcstd",
        "gltf",
        "glb",
        "ifc",
        "iges",
        "igs",
        "step",
        "stp",
        "stl",
        "obj",
        "off",
        "ply",
        "wrl",
      ];
      if (!ext || !allowed.includes(ext)) {
        alert(
          "지원하지 않는 형식입니다.\n허용: 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf/glb, ifc, iges, step, stl, obj, off, ply, wrl"
        );
        return;
      }
      const previewable = ["gltf", "glb"];
      if (!previewable.includes(ext)) {
        alert(
          "현재 미리보기는 glTF(.gltf, .glb)만 지원합니다.\n파일은 저장되지만 미리보기는 표시되지 않습니다."
        );
        return;
      }
      const url = URL.createObjectURL(file);
      setModel({ file, url, ext });
      navigate("/editor");
    },
    [navigate, setModel]
  );

  return (
    <MainSection id="main" onDragOver={onDragOver} onDrop={onDrop}>
      <MainBox>
        <Title>
          <img width={400} src={"/logo.png"} alt="Vieweer" />
          <TitleText>Drag and drop 3D models here.</TitleText>
        </Title>
        <CheckBox>
          <SectionLabel>Check an example file:</SectionLabel>
          <Boxs>
            {SUPPORTED_FORMATS.map((fmt) => (
              <FileChip
                to="/editor"
                key={fmt}
                aria-label={`open ${fmt} in editor`}
              >
                {fmt}
              </FileChip>
            ))}
          </Boxs>
        </CheckBox>
        {/* <DebugActions>
          <DebugButton to="/editor">Go to editor (debug)</DebugButton>
        </DebugActions> */}
      </MainBox>
    </MainSection>
  );
}

export default Main;
