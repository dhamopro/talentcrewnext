import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { z } from 'zod'
import { Education } from '@/app/types/education.type'

const baseUrl = 'https://pb.talentcrew.tekishub.com/api'

const axiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/Education/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

export const educationSchema = z.object({
    id: z.string(),
    collegeName: z.string(),
    from: z.string(),
    to: z.string(),
    course: z.string(),
    grade: z.string(),
    candidate: z.array(z.string()),
    university: z.string(),
    degree: z.string(),
    subject: z.string(),
    institution: z.string(),
    university1: z.string(),
    cpga: z.string(),
    passOut: z.string(),
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
        const data: Partial<Education> = JSON.parse(_data as string);
        educationSchema.parse(data);
        const data_response = await axiosInstance.post('/', data);
        const recordId = data_response.data.id;

        return NextResponse.json({
            data: data_response.data,
            id: recordId
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    const response = await axiosInstance.patch('/', req.body)
    return NextResponse.json(response.data)
}
