"use client"
import { useState, FormEvent } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [files, setFiles] = useState({
    resume: null,
    candidate_picture: null,
    document: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('data', JSON.stringify(formData));  // Ensure 'data' field is correct
    data.append('resume', files.resume as unknown as Blob);
    data.append('candidate_picture', files.candidate_picture as unknown as Blob);
    data.append('document', files.document as unknown as Blob);

    const response = await fetch('/api/candidate', {
      method: 'POST',
      body: data,
    });

    if (response.ok) {
      alert('Candidate submitted successfully!');
    } else {
      alert('Failed to submit candidate.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        className="text-black"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        className="text-black"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="resume"
        accept=".pdf"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="candidate_picture"
        accept="image/*"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="document"
        accept=".pdf"
        onChange={handleChange}
        required
      />
      <button type="submit" className="text-white bg-blue-500">Submit</button>
    </form>
  );
}
