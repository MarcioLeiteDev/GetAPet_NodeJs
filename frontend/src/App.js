import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

/* pages */
import Home from './components/pages/Auth/Home'
import Login from './components/pages/Auth/login';
import Register from './components/pages/Auth/Register';

/* layouts */
import Navbar from './components/pages/Layouts/Navbar'
import Footer from './components/pages/Layouts/Footer'

import Container from '././components/pages/Layouts/Container'

function App() {
  return (
    <Router>
      <Navbar />
      <Container>

        <Routes>

          <Route path='/login' element={<Login />}>  </Route>

          <Route path='/register' element={<Register />}>  </Route>

          <Route path='/' element={<Home />}> </Route>

        </Routes>


      </Container>

      <Footer />

    </Router>

  );
}

export default App;
