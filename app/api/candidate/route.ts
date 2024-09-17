import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { z } from 'zod'

// Initialize Axios
const axiosInstance = axios.create({
    baseURL: 'https://pb.talentcrew.tekishub.com/api/collections/Candidate/records',
    headers: {
        'Content-Type': 'application/json',
    },
})

interface Candidate {
    id?: string
    first_name: string
    middle_name?: string
    last_name: string
    display_name: string
    phone: number
    alt_phone?: number
    email: string
    alt_email?: string
    gender: string
    skill_set?: string[]
    secondary_skill_set?: string[]
    current_ctc: number
    expected_ctc: number
    notice_period: string
    total_exp: number
    relavant_exp: number
    location?: string
    preffered_location?: string[]
    date_of_birth: string
    current_organisation?: string
    highest_education_degree?: string
    college_studied?: string
    university_studied?: string
    year_of_passing: number
    linkedin_id?: string
    resume?: string
    document_type?: string[]
    document?: string[]
    document_number?: string
    issue_date?: string
    expiry_date?: string
    source_type?: string
    source_name?: string
    preffered_job?: string[]
    candidate_picture?: string
    uan_number?: string
    comments?: string
    pan_number?: string
    PreferredJob?: string
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '30'
    const sort = searchParams.get('sort') || ''
    const filter = searchParams.get('filter') || ''
    const expand = searchParams.get('expand') || ''
    const fields = searchParams.get('fields') || ''

    try {
        const response = await axiosInstance.get('', {
            params: { page, perPage, sort, filter, expand, fields }
        })
        return NextResponse.json(response.data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    // {{ edit_1 }}
    // Updated POST method to handle file uploads using formData
    try {
        const formData = await request.formData()

        const pbFormData = new FormData()

        formData.forEach((value, key) => {
            pbFormData.append(key, value)
        })

        const response = await axiosInstance.post('', pbFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return NextResponse.json(response.data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create candidate', details: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    try {
        await axiosInstance.delete(`/${id}`)
        return NextResponse.json({ message: 'Candidate deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data: Partial<Candidate> = await request.json()
    const validatedData = validatePartialCandidate(data)

    try {
        const response = await axiosInstance.patch(`/${id}`, validatedData)
        return NextResponse.json(response.data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 })
    }
}

// Add partial validation for PATCH requests
const validatePartialCandidate = (data: Partial<Candidate>) => {
    const schema = z.object({
        first_name: z.string().min(3).max(255).optional(),
        middle_name: z.string().min(3).max(255).optional(),
        last_name: z.string().min(3).max(255).optional(),
        display_name: z.string().optional(),
        phone: z.number().min(1000000000).max(9999999999).optional(),
        alt_phone: z.number().min(1000000000).max(9999999999).optional(),
        email: z.string().email().optional(),
        alt_email: z.string().email().optional(),
        gender: z.string().optional(),
        skill_set: z.array(z.string()).optional(),
        secondary_skill_set: z.array(z.string()).optional(),
        current_ctc: z.number().optional(),
        expected_ctc: z.number().optional(),
        notice_period: z.string().optional(),
        total_exp: z.number().optional(),
        relavant_exp: z.number().optional(),
        location: z.string().optional(),
        preffered_location: z.array(z.string()).optional(),
        date_of_birth: z.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional(),
        current_organisation: z.string().optional(),
        highest_education_degree: z.string().optional(),
        college_studied: z.string().optional(),
        university_studied: z.string().optional(),
        year_of_passing: z.number().min(1900).max(new Date().getFullYear()).optional(),
        linkedin_id: z.string().url().optional(),
        resume: z.string().optional(),
        document_type: z.array(z.string()).optional(),
        document_number: z.string().optional(),
        issue_date: z.string().optional(),
        expiry_date: z.string().optional(),
        source_type: z.string().optional(),
        source_name: z.string().optional(),
        preffered_job: z.array(z.string()).optional(),
        uan_number: z.string().optional(),
        comments: z.string().optional(),
        pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/).optional(),
        PreferredJob: z.string().optional()
    });
    return schema.parse(data);
}

const validation = (data: Candidate) => {
    const schema = z.object({
        first_name: z.string().min(3).max(255),
        middle_name: z.string().min(3).max(255).optional(),
        last_name: z.string().min(3).max(255),
        display_name: z.string().optional(),
        phone: z.number().min(1000000000).max(9999999999),
        alt_phone: z.number().min(1000000000).max(9999999999).optional(),
        email: z.string().email(),
        alt_email: z.string().email().optional(),
        gender: z.string(),
        skill_set: z.array(z.string()).optional(),
        secondary_skill_set: z.array(z.string()).optional(),
        current_ctc: z.number(),
        expected_ctc: z.number(),
        notice_period: z.string(),
        total_exp: z.number(),
        relavant_exp: z.number(),
        location: z.string(),
        preffered_location: z.array(z.string()).optional(),
        date_of_birth: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
        current_organisation: z.string().optional(),
        highest_education_degree: z.string().optional(),
        college_studied: z.string().optional(),
        university_studied: z.string().optional(),
        year_of_passing: z.number().min(1900).max(new Date().getFullYear()),
        linkedin_id: z.string().url().optional(),
        resume: z.string().optional(),
        document_type: z.array(z.string()).optional(),
        document_number: z.string().optional(),
        issue_date: z.string().optional(),
        expiry_date: z.string().optional(),
        source_type: z.string().optional(),
        source_name: z.string().optional(),
        preffered_job: z.array(z.string()).optional(),
        uan_number: z.string().optional(),
        comments: z.string().optional(),
        pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/).optional(),
        PreferredJob: z.string().optional()
    });
    return schema.parse(data);
}