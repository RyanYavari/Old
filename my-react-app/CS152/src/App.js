import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const [guess, setGuess] = useState('');

  const handleSubmit = async () => {
    const canvas = canvasRef.current.getTrimmedCanvas();
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'drawing.png');

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setGuess(response.data.guess);
      } catch (error) {
        console.error('Error uploading the drawing:', error);
      }
    }, 'image/png');
  };

  return (
    <div className="App">
      <div className="canvas-container">
        <SignatureCanvas
          ref={canvasRef}
          penColor="black"
          canvasProps={{ width: 400, height: 400, className: 'sigCanvas' }}
        />
        <button onClick={handleSubmit}>Submit Drawing</button>
      </div>
      <div className="guess-container">
        <h1>Current Guess: {guess}</h1>
      </div>
    </div>
  );
};

export default App;