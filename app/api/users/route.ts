import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const URL = "https://pb.talentcrew.tekishub.com/api/collections/users/records";

export async function GET(request: NextRequest) {

}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log(data);
        const res = await axios.post(URL, data);
        return NextResponse.json({ message: res.data }, { status: 200 });
    } catch (error: any) {
        console.log("ERROR", error.response.data);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

