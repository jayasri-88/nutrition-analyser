import React, { useState } from 'react';
import './App.css';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';
import UploadForm from './components/UploadForm';

function App() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult]=useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file || !age || !gender) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('age', age);
  formData.append('gender', gender);

  try {
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Server Response:', response.data);
    setResult(response.data); 
  } catch (error) {
    console.error('Error uploading:', error);
    alert('Upload failed. Please try again.');
  }
};


  return (
    <div className='app-container'>
      <header>
        <h1>Nutrition Label Analyzer</h1>
        <p>Get personalized health insights from food labels</p>
      </header>

      <main style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', padding: '2rem' }}>
        {/* Left Side - Input Form */}
        <section style={{ flex: 1, minWidth: '300px' }}>
          <form onSubmit={handleSubmit}>
            {/* Upload Section */}
            <section className="upload-section">
              <h2>Upload Nutrition Label</h2>
              <label className="upload-box">
                <span className="upload-icon"><FaUpload /></span>
                <span className="upload-text">Click to upload or drag & drop</span>
                <input type="file" onChange={handleFileChange} />
              </label>
            </section>

            {/* Age Section */}
            <div className='age-section'>
              <h2>Enter Age</h2>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder='Enter your age'
                min='1'
                required
              />
            </div>

            {/* Gender Section */}
            <section className='gender-section'>
              <h2>Select Gender</h2>
              <div className='gender-options'>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Other
                </label>
              </div>
            </section>

            {/* Submit */}
            <div className='submit-button'>
              <button type='submit'>Analyze</button>
            </div>
          </form>
        </section>

        {/* Yellow Divider */}
        <div style={{ width: '3px', backgroundColor: '#fdd835', borderRadius: '2px' }}></div>

        {/* Right Side - Results */}
        <section className='results-section' style={{ flex: 1, minWidth: '300px' }}>
          <h2>Analyzed Report</h2>
          {file ? (
            <p>Uploaded File: <strong>{file.name}</strong></p>
          ) : (
            <p>No file uploaded yet</p>
          )}
          {result && (
            <div style={{ marginTop: '30px' }}>
              <h3>Extracted Text</h3>
              <pre>{result.extractedText}</pre>
              <h3>Health Score</h3>
              <p><strong>{result.analysis?.score}/100</strong></p>
              <p><strong>Age:</strong> {result.analysis?.age}</p>
              <p><strong>Gender:</strong> {result.analysis?.gender}</p>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>© 2025 Nutrition Analyzer | Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
