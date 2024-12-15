import { getReverseLocation } from "@/api/handler";
import { GeolocationResponse, IGeoLocationsResponse } from "@/types";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  data?: IGeoLocationsResponse;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const geolocationResults = await axios.get<GeolocationResponse>(
      `https://geolocation-db.com/json/${req.socket.remoteAddress}`
    );

    const result = await getReverseLocation(
      geolocationResults.data.latitude,
      geolocationResults.data.longitude
    );

    res.status(200).json({ data: result.data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
