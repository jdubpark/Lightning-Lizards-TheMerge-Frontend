import axios from 'axios'

export interface CoordinateData {
	_id: 'string'
	color: {
		R: number
		G: number
		B: number
	}
	owner: string
	price: number
}

export default class ApiClient {
	static async getCoordinateData(x: number, y: number): Promise<CoordinateData> {
		const url = `https://us-east-1.aws.data.mongodb-api.com/app/dataapi-cmuqf/endpoint/canvas?key=${x}-${y}`
		return axios.get<CoordinateData[]>(url).then((res) => res.data[0])
	}


	static async getEtherScanLink(address: string): Promise<string> {
		return `https://etherscan.io/address/${address}`
	}

	static async getUserPixels(address: string): Promise<CoordinateData[]> {
		const url = `https://us-east-1.aws.data.mongodb-api.com/app/dataapi-cmuqf/endpoint/user?address=${address}`
		return axios.get<CoordinateData[]>(url).then((res) => res.data)
	}
}
