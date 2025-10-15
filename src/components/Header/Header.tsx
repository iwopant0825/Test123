import styled from "styled-components";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ModelContext } from "../../contexts/ModelContext";

const HeaderWrapper = styled.header`
  width: 100%;
`;

const Container = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 12px;
  padding: 0 1rem;
`;

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
`;

const IconGroup = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: end;
`;

const CenterTitle = styled.div`
  justify-self: center;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  max-width: 60vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
`;

// 아이콘 버튼/글리프는 현재 사용하지 않으므로 제거

function Header() {
  const location = useLocation();
  const { model } = useContext(ModelContext);
  const isEditor = location.pathname.startsWith("/editor");
  const fileName = model.file?.name ?? "";
  return (
    <HeaderWrapper>
      <Container>
        <Brand href="#">
          <img src={"/logo.png"} alt="Vieweer" />
        </Brand>
        <CenterTitle>{isEditor && fileName ? fileName : ""}</CenterTitle>
        <IconGroup>
          <img width={110} src="/imgs/etc.png" alt="ect" />
        </IconGroup>
      </Container>
    </HeaderWrapper>
  );
}

export default Header;
