import {connection, COMMITMENT} from './connection';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import {FAILED_TO_FIND_ACCOUNT, INVALID_ACCOUNT_OWNER} from './ErrorHandling'

export const getAccountInfo = async(
    account
) => {
    let accountPub = new PublicKey(account);
    const info = await connection.getAccountInfo(accountPub, COMMITMENT);

    if(info === null){
      throw new Error(FAILED_TO_FIND_ACCOUNT);
    }

    if (!info.owner.equals(TOKEN_PROGRAM_ID)) {
      throw new Error(INVALID_ACCOUNT_OWNER);
    }
    
    if (info.data.length !== AccountLayout.span) {
      throw new Error('Invalid account size');
    }
}