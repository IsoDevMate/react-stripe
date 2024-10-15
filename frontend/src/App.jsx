import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Error from './error';
import { Queue } from './components/queue';
import { StripePaymentPage } from './components/payments';
import  {Success}  from '../src/components/success'
import  {Cancel}  from '../src/components/cancel'

const Container = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);


function App() {
  return (
    <Router>
       <Container>
        <Routes>
        <Route path="/" element={<Queue />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
         
          <Route path="/stripe-payment" element={<StripePaymentPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Container>
    </Router>
  
  );
}

export default App;