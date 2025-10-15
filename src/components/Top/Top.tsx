import styled from "styled-components";
import { useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../../contexts/ModelContext";

const TopSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3d3e42;
  padding: 0; /* 좌우 패딩 제거 */
`;

const Left = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  padding-left: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Right = styled.div``;

function Top() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setModel } = useContext(ModelContext);

  const onPick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
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
    <TopSection id="top">
      <Left onClick={onPick}>
        <img width={80} src="/imgs/file.png" alt="imgs" />
        <input
          ref={inputRef}
          type="file"
          accept=".3dm,.3ds,.3mf,.amf,.bim,.brep,.dae,.fbx,.fcstd,.gltf,.glb,.ifc,.iges,.igs,.step,.stp,.stl,.obj,.off,.ply,.wrl"
          style={{ display: "none" }}
          onChange={onChange}
        />
      </Left>
      <Right></Right>
    </TopSection>
  );
}

export default Top;
