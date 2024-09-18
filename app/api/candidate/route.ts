import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { z } from 'zod'
import { Candidate } from '@/app/types/candidate.type'

const baseUrl = 'https://pb.talentcrew.tekishub.com/api'
// Initialize Axios
const axiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/Candidate/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const response = await axiosInstance.get(`/${id}`)
    return NextResponse.json(response.data)
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // multipart form data
        const formData = await req.formData();
        const _data = formData.get('data');
        const data: Partial<Candidate> = JSON.parse(_data as string);
        const resume = formData.get('resume') as File;
        const candidate_picture = formData.get('candidate_picture') as File;
        const document = formData.get('document') as File;

        // Create candidate record (don't append ID here)
        const data_response = await axiosInstance.post('/', data);  // Make sure this is posting to the base URL
        const recordId = data_response.data.id;

        console.log(recordId);

        // Upload files to the created candidate record
        const uploadFile = async (file: File, fieldName: string) => {
            const fileFormData = new FormData();
            fileFormData.append(fieldName, file);
            console.log(fileFormData.get(fieldName));
            return axiosInstance.patch(`/${recordId}`, fileFormData);  // Use the ID here for uploading files
        };

        await uploadFile(resume, 'resume');
        await uploadFile(candidate_picture, 'candidate_picture');
        await uploadFile(document, 'document');

        return NextResponse.json({
            data: data_response.data
        });
    } catch (error) {
        console.log('Error in POST /api/candidate:', error);
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    const response = await axiosInstance.put('/', req.body)
    return NextResponse.json(response.data)
}
