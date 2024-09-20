import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { z } from 'zod'
import { Candidate } from '@/app/types/candidate.type'
import { educationSchema } from '../education/route'
import { experienceSchema } from '../experience/route'
import { certificationSchema } from '../certificate/route'

const baseUrl = 'https://pb.talentcrew.tekishub.com/api'

const axiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/Candidate/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

const educationAxiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/Education/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

const experienceAxiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/Experience/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

const certificationAxiosInstance = axios.create({
    baseURL: `${baseUrl}/collections/CandidateCertification/records`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
})

const candidateSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    display_name: z.string(),
    phone: z.number(),
    alt_phone: z.number(),
    email: z.string().email(),
    alt_email: z.string().email(),
    gender: z.string(),
    current_ctc: z.number(),
    expected_ctc: z.number(),
    notice_period: z.string(),
    total_exp: z.number(),
    relavant_exp: z.number(),
    location: z.string(),
    preffered_location: z.array(z.string()),
    date_of_birth: z.string(),
    current_organisation: z.string(),
    education: z.array(educationSchema),
    experience: z.array(experienceSchema),
    certification: z.array(certificationSchema),
    linkedin_id: z.string(),
    resume: z.string(),
    document_type: z.array(z.string()),
    document_number: z.string(),
    issue_date: z.string(),
    expiry_date: z.string(),
    source_type: z.string(),
    source_name: z.string(),
    preffered_job: z.array(z.string()),
    uan_number: z.string(),
    comments: z.string(),
    pan_number: z.string(),
    PreferredJob: z.string(),
    skillset: z.array(z.string()),
    secondary_skill_set: z.array(z.string()),
})

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const response = await axiosInstance.get(`/${id}`)
    return NextResponse.json(response.data)
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const _data = formData.get('data');

        const data: Partial<Candidate> = JSON.parse(_data as string);
        const _education = data.education || [];
        const _experience = data.experience || [];
        const _certification = data.certification || [];

        delete data.education;
        delete data.experience;
        delete data.certification;

        candidateSchema.parse(data);

        const data_response = await axiosInstance.post('/', data);
        const recordId = data_response.data.id;

        const uploadFile = async (file: File, fieldName: string) => {
            const fileFormData = new FormData();
            fileFormData.append(fieldName, file, file.name);
            return axiosInstance.patch(`/${recordId}`, fileFormData);
        };

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                await uploadFile(value, key);
            }
        }

        for (const education of _education) {
            education.candidate = [recordId];
            educationSchema.parse(education);
            await educationAxiosInstance.post('/', education);
        }

        for (const experience of _experience) {
            experience.candidate = [recordId];
            experienceSchema.parse(experience);
            await experienceAxiosInstance.post('/', experience);
        }

        for (const certification of _certification) {
            certification.candidate = [recordId];
            certificationSchema.parse(certification);
            await certificationAxiosInstance.post('/', certification);
        }

        return NextResponse.json({
            data: data_response.data
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {

        const formData = await req.formData();
        const _data = formData.get('data');

        const data: Partial<Candidate> = JSON.parse(_data as string);
        if (!data.id) { throw new Error('Candidate ID is required') }
        const _education = data.education || [];
        const _experience = data.experience || [];
        const _certification = data.certification || [];

        delete data.education;
        delete data.experience;
        delete data.certification;

        candidateSchema.parse(data);

        const data_response = await axiosInstance.patch('/' + data.id, data);
        const recordId = data_response.data.id;

        const uploadFile = async (file: File, fieldName: string) => {
            const fileFormData = new FormData();
            fileFormData.append(fieldName, file, file.name);
            return axiosInstance.patch(`/${recordId}`, fileFormData);
        };

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                await uploadFile(value, key);
            }
        }

        for (const education of _education) {
            education.candidate = [recordId];
            educationSchema.parse(education);
            if (education.id) {
                await educationAxiosInstance.patch('/' + education.id, education);
            } else {
                await educationAxiosInstance.post('/', education);
            }
        }

        for (const experience of _experience) {
            experience.candidate = [recordId];
            experienceSchema.parse(experience);
            if (experience.id) {
                await experienceAxiosInstance.patch('/' + experience.id, experience);
            } else {
                await experienceAxiosInstance.post('/', experience);
            }
        }

        for (const certification of _certification) {
            certification.candidate = [recordId];
            certificationSchema.parse(certification);
            if (certification.id) {
                await certificationAxiosInstance.patch('/' + certification.id, certification);
            } else {
                await certificationAxiosInstance.post('/', certification);
            }
        }

        return NextResponse.json({
            data: data_response.data
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}