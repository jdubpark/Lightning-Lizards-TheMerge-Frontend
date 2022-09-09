import {useEffect, useState} from "react";
import {useAccount} from "wagmi";

import ApiClient, {CoordinateData} from "../../utils/ApiClient";

function PixelBlob({ cd }: { cd: CoordinateData }) {
	return (
		<div key={cd._id}>
			<div>Pixel ({cd._id.replace('-', ', ')})</div>
			<div
				className={`h-10 w-10 mt-3 border-4 border-black`}
				style={{
					backgroundColor: `rgb(${cd.color.R}, ${cd.color.G}, ${cd.color.B})`,
				}}
			/>
		</div>
	)
}

export default function UserPixelsList() {
	const { address } = useAccount()
	const [pixels, setPixels] = useState<CoordinateData[]>([])

	useEffect(() => {
		if (!address) return
		ApiClient.getUserPixels(address)
			.then((cds) => setPixels(cds))
	}, [address])

	return (
		<div>
			<div>Your Pixels:</div>
			<div>
				{
					pixels.length === 0 ? (
						<div>
							You don&apos;t own any pixels!
						</div>
					) : (
						<>
							{pixels.map((cd) => <PixelBlob cd={cd} key={cd._id} />)}
						</>
					)
				}
			</div>
		</div>
	)
}
