import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !age || !gender) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('age', age);
    formData.append('gender', gender);

    try {
      setLoading(true);

      // Upload image and get OCR + analysis result from backend
      const response = await axios.post("http://localhost:5000/api/upload", formData);
      setResult({
        extractedText: response.data.extractedText,
        analysis: response.data.analysis
      });

    } catch (error) {
      console.error("❌ Upload or analysis failed:", error?.response?.data || error.message);
      alert(`Upload failed: ${error?.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload Nutrition Label</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        <br /><br />
        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br /><br />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Analyze'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h3>Analysis Result</h3>
          <pre>{result.extractedText}</pre>
          <h3>Health Score</h3>
          <p><strong>{result.analysis.score}/100</strong></p>
          <p><strong>Age:</strong> {result.analysis.age}</p>
          <p><strong>Gender:</strong> {result.analysis.gender}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
