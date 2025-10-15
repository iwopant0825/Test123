import styled from 'styled-components'
import Header from './components/Header/Header'
import Top from './components/Top/Top'
import Main from './components/Main/Main'
import EditorMain from './components/Editor/EditorMain'
import { Routes, Route } from 'react-router-dom'
import { ModelProvider } from './contexts/ModelContext.tsx'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  height:100vh;
  color: #f7f7f7;
`;

const Content = styled.main`
  width:100%;
  height:100%;
`;

function App() {
  return (
    <ModelProvider>
      <AppContainer>
        <Header />
        <Top />
        <Content>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/editor" element={<EditorMain />} />
          </Routes>
        </Content>
      </AppContainer>
    </ModelProvider>
  )
}

export default App
