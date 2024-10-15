import './css/cancel.css'
import { CgDanger } from "react-icons/cg";
import { Link } from 'react-router-dom';

export const Cancel = () => {
  return (
    <div className='main'>
        <div className='fail-page'>
            <div className="fail-icon">
                <CgDanger />
            </div>
            <h1>Payment Unsuccessful</h1>
            <h3>Error Processing your payment</h3>
            <p>Click on the button to go back</p>
            <Link to= '/queue' >
                <button>Back</button>
            </Link>
            
        </div>
    </div>
  )
}

