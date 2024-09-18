import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { z } from 'zod'
import { Candidate } from '@/app/types/candidate.type'

const baseUrl = 'https://pb.talentcrew.tekishub.com/api'

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
        const formData = await req.formData();
        const _data = formData.get('data');
        const data: Partial<Candidate> = JSON.parse(_data as string);
        const data_response = await axiosInstance.post('/', data);
        const recordId = data_response.data.id;
        const uploadFile = async (file: File, fieldName: string) => {
            const fileFormData = new FormData();
            fileFormData.append(fieldName, file, file.name);
            console.log(fileFormData.get(fieldName));
            return axiosInstance.patch(`/${recordId}`, fileFormData);
        };
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                await uploadFile(value, key);
            }
        }

        return NextResponse.json({
            data: data_response.data
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    const response = await axiosInstance.patch('/', req.body)
    return NextResponse.json(response.data)
}
