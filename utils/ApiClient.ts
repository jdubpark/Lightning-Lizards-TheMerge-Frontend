import axios from 'axios';
import { BigNumber } from 'ethers';

export interface CoordinateData {
    _id: 'string';
    color: {
        R: number;
        G: number;
        B: number;
    };
    owner: string;
    price: string;
}

export default class ApiClient {
    static async getCoordinateData(
        x: number,
        y: number
    ): Promise<CoordinateData> {
        const url = `https://us-east-1.aws.data.mongodb-api.com/app/dataapi-cmuqf/endpoint/canvas?key=${x}-${y}`;
        return axios.get<CoordinateData[]>(url).then((res) => res.data[0]);
    }

    static async getEtherScanLink(address: string): Promise<string> {
        return `https://etherscan.io/address/${address}`;
    }

    static async getUserPixels(address: string): Promise<CoordinateData[]> {
        const url = `https://us-east-1.aws.data.mongodb-api.com/app/dataapi-cmuqf/endpoint/user?address=${address}`;
        return axios.get<CoordinateData[]>(url).then((res) => res.data);
    }

    static async getHashRate(): Promise<BigNumber> {
        const url = `https://api.minerstat.com/v2/coins?list=ETH`;
        return axios.get<{ network_hashrate: string }[]>(url).then((res) => {
            return BigNumber.from(res.data[0].network_hashrate);
        });
    }
}
