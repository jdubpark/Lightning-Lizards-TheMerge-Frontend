export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const MERGE_CANVAS_CONTRACT_ADDRESS =
	(IS_PRODUCTION ? process.env.MERGE_CANVAS_CONTRACT_ADDRESS : process.env.MERGE_CANVAS_CONTRACT_ADDRESS_DEV) as string
