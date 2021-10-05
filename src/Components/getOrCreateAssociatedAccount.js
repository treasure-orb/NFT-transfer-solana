import { PublicKey } from '@solana/web3.js';
import {findAssociatedTokenAccountPublicKey, } from './associatedAccounts';
import { getAccountInfo } from './getAccountInfo'; 
import {createAssociatedTokenAccount} from '../react component/TransferToken/AssociatedAccounts';

export const getOrCreateAssociatedAccount = async(owner, mint, payer) => {
    let pubOwner = new PublicKey(owner); 
    let pubMint = new PublicKey(mint);
    let payerPub = new PublicKey(payer);

    let associatedAddress = await findAssociatedTokenAccountPublicKey(pubOwner, pubMint)
    
    try{
        return await getAccountInfo(associatedAddress);
    }catch(err){
        if(err){
            try{
                await createAssociatedTokenAccount(
                    null,
                    true,
                    pubMint,
                    pubOwner,
                    payerPub,
                )
            }catch(err){
                console.log(err);
            }
        }
    }
    return associatedAddress;
}