import routes from './routes'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotificationProvider } from './context/notificationContext';
import NotificationModule from './components/notificationModule';

function App() {

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const { path, element } = route;
            return <Route key={index} path={path} element={element} />
      })}
        </Routes>
      </BrowserRouter>
      <NotificationModule />
    </NotificationProvider>
  )
}

export default App
