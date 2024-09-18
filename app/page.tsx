"use client"
import { useState, FormEvent } from 'react';
import { z, ZodError } from 'zod';

// Define the validation schema using Zod
const schema = z.object({
  first_name: z.string({ message: "First Name is required" }),
  middle_name: z.string().optional(),
  last_name: z.string({ message: "Last Name is required" }),
  display_name: z.string().optional(),
  phone: z.string({ message: "Phone is required" }),
  alt_phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  alt_email: z.string().email({ message: "Invalid alternate email address" }).optional(),
  gender: z.string().optional(),
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
  notice_period: z.string().optional(),
  total_exp: z.string().optional(),
  relavant_exp: z.string().optional(),
  location: z.string().optional(),
  preffered_location: z.string().optional(),
  date_of_birth: z.string().optional(),
  current_organisation: z.string().optional(),
  highest_education_degree: z.string().optional(),
  college_studied: z.string().optional(),
  university_studied: z.string().optional(),
  year_of_passing: z.string().optional(),
  linkedin_id: z.string().optional(),
  source_type: z.string().optional(),
  source_name: z.string().optional(),
  preffered_job: z.string().optional(),
  uan_number: z.string().optional(),
  comments: z.string().optional(),
  pan_number: z.string().optional(),
  PreferredJob: z.string().optional(),
  skillset: z.string().optional(),
  secondary_skill_set: z.string().optional(),
});

export default function Home() {
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    phone: '',
    alt_phone: '',
    email: '',
    alt_email: '',
    gender: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period: '',
    total_exp: '',
    relavant_exp: '',
    location: '',
    preffered_location: '',
    date_of_birth: '',
    current_organisation: '',
    highest_education_degree: '',
    college_studied: '',
    university_studied: '',
    year_of_passing: '',
    linkedin_id: '',
    source_type: '',
    source_name: '',
    preffered_job: '',
    uan_number: '',
    comments: '',
    pan_number: '',
    PreferredJob: '',
    skillset: '',
    secondary_skill_set: '',
  });

  const [files, setFiles] = useState({
    resume: null,
    candidate_picture: null,
    document: null,
  });

  const [errorMessage, setErrorMessage] = useState<any>({});

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
    try {
      // Validate form data
      schema.parse(formData);

      const data = new FormData();
      data.append('data', JSON.stringify(formData));
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
    } catch (error) {
      if (error instanceof ZodError) {
        let newFormErrors: any = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          newFormErrors[fieldName] = err.message;
        });
        setErrorMessage(newFormErrors);
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 mx-auto p-4 bg-white text-black shadow-md rounded-md'>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Personal Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="flex-1 border border-gray-300 p-2 rounded-md" />
              {errorMessage.first_name && <p className="text-red-500">{errorMessage.first_name}</p>}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Middle Name</label>
              <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="flex-1 border border-gray-300 p-2 rounded-md" />
              {errorMessage.last_name && <p className="text-red-500">{errorMessage.last_name}</p>}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Display Name</label>
              <input type="text" name="display_name" value={formData.display_name} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="flex-1 border border-gray-300 p-2 rounded-md" />
              {errorMessage.phone && <p className="text-red-500">{errorMessage.phone}</p>}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Alternate Phone</label>
              <input type="tel" name="alt_phone" value={formData.alt_phone} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="flex-1 border border-gray-300 p-2 rounded-md" />
              {errorMessage.email && <p className="text-red-500">{errorMessage.email}</p>}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Alternate Email</label>
              <input type="email" name="alt_email" value={formData.alt_email} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
              {errorMessage.alt_email && <p className="text-red-500">{errorMessage.alt_email}</p>}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Gender</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Date of Birth</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Professional Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Current CTC</label>
              <input type="number" name="current_ctc" value={formData.current_ctc} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Expected CTC</label>
              <input type="number" name="expected_ctc" value={formData.expected_ctc} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Notice Period</label>
              <input type="text" name="notice_period" value={formData.notice_period} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Total Experience</label>
              <input type="number" name="total_exp" value={formData.total_exp} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Relevant Experience</label>
              <input type="number" name="relavant_exp" value={formData.relavant_exp} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Current Organisation</label>
              <input type="text" name="current_organisation" value={formData.current_organisation} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Highest Education Degree</label>
              <input type="text" name="highest_education_degree" value={formData.highest_education_degree} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">College Studied</label>
              <input type="text" name="college_studied" value={formData.college_studied} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">University Studied</label>
              <input type="text" name="university_studied" value={formData.university_studied} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Year of Passing</label>
              <input type="number" name="year_of_passing" value={formData.year_of_passing} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">LinkedIn ID</label>
              <input type="text" name="linkedin_id" value={formData.linkedin_id} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Source Type</label>
              <input type="text" name="source_type" value={formData.source_type} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Source Name</label>
              <input type="text" name="source_name" value={formData.source_name} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Preferred Job</label>
              <input type="text" name="preffered_job" value={formData.preffered_job} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">UAN Number</label>
              <input type="text" name="uan_number" value={formData.uan_number} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Comments</label>
              <input type="text" name="comments" value={formData.comments} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">PAN Number</label>
              <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Skillset</label>
              <input type="text" name="skillset" value={formData.skillset} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Secondary Skill Set</label>
              <input type="text" name="secondary_skill_set" value={formData.secondary_skill_set} onChange={handleChange} className="flex-1 border border-gray-300 p-2 rounded-md" />
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Attachments</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Resume</label>
              <input type="file" name="resume" accept=".pdf" onChange={handleChange} required className="flex-1" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Candidate Picture</label>
              <input type="file" name="candidate_picture" accept="image/*" onChange={handleChange} required className="flex-1" />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="w-1/3">Document</label>
              <input type="file" name="document" accept=".pdf" onChange={handleChange} required className="flex-1" />
            </div>
          </div>
        </fieldset>

        <button type="submit" className="text-white bg-blue-500 p-2 rounded-md">Submit</button>
      </form>
    </div>
  );
}
