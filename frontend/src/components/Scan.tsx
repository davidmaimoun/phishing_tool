import React, { useState } from 'react';
import MyInput from './all/Input';
import MyButton from './all/Button';
import MyLoader from './all/Loader';
import Card from './all/Card';
import { scanURL, stopScan } from '../services/scanServices';
import { toast } from 'react-toastify';

const ScanPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [scanned, setScanned] = useState(false); // To trigger the animation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleScan = async() => {
    const result = await scanURL(url)
    
    if (result) {
        setScanned(true)
        toast.success("Scan Running")
        setMessage(result.message);
        console.log(result)
    }
  
  };

  const abortScan = async() => {
    const result = await stopScan()
    console.log(result)
    if (result) {
      setScanned(false)
      toast.error("Scan Aborted")
    }
    
  }


  return (
    <div className='scan-page'>
      <div style={{ display: scanned ? 'inline':'none' }} className="scan-box-run">
        <Card title=''>
          <MyLoader loading={true} size={30}/>
            { message && <p>{message}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MyButton 
                label={"Stop Scan"} 
                color='danger'
                onClick={abortScan}/>
          </div>
        </Card>
       
      </div>
      
      <div style={{ display: !scanned ? 'inline':'none' }} className="scan-box">
        <Card title='Url Scanner'>
          <MyInput
                type="text"
                placeholder="Enter URL 10.10.X.X"
                value={url}
                onChange={handleChange}
            />

            <MyButton 
                label={"Scan Now!"} 
                onClick={handleScan}/>
        </Card>
      </div>

    
    </div>
  );
};

export default ScanPage;
