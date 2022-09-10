import { ethers } from 'ethers';

/**
 * Truncate string from the middle to outer to match the maxLength
 * @param input
 * @param maxLength
 */
export function midEllipsis(input: string, maxLength: number): string {
    if (input.length <= maxLength) return input;
    const middle = Math.ceil(input.length / 2);
    const excess = Math.ceil((input.length - maxLength) / 2);
    return `${input.substring(0, middle - excess)}...${input.substring(
        middle + excess
    )}`;
}

export const formatPrice = (rawPrice: string): string => {
    const weiPrice = ethers.utils.formatUnits(rawPrice, 'wei');
    if (weiPrice.toString().length < 9) {
        return `${weiPrice} WEI`;
    }
    const gweiPrice = ethers.utils.formatUnits(rawPrice, 'gwei');
    if (gweiPrice.toString().length < 9) {
        return `${gweiPrice} GWEI`;
    }
    const ethPrice = ethers.utils.formatUnits(rawPrice, 'ether');
    return `${ethPrice} ETH`;
};
