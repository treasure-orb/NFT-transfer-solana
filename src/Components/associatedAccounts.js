import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {connection} from "./connection";
import { sendTxUsingExternalSignature } from './externalWallet';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const createIx = (funderPubkey, associatedTokenAccountPublicKey, ownerPublicKey, tokenMintPublicKey
) =>
  new TransactionInstruction({
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
    keys: [
      { pubkey: funderPubkey, isSigner: true, isWritable: true },
      {
        pubkey: associatedTokenAccountPublicKey,
        isSigner: false,
        isWritable: true
      },
      { pubkey: ownerPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
    ]
});

export const findAssociatedTokenAccountPublicKey = async(ownerPublicKey, tokenMintPublicKey) =>(
    await PublicKey.findProgramAddress(
        [
            ownerPublicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintPublicKey.toBuffer()
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
)[0];

export const createAssociatedTokenAccount = async(
    feePayer, //dont need it since we are externally signing the transaction 
    feePayerSignsExternally, //true 
    tokenMintAddress, //token public address //
    ownerAddress //token owner address //string
) => {

    //owner is the creator assuming that.
    const tokenMintPublicKey = new PublicKey(tokenMintAddress); 
    const ownerPublicKey = new PublicKey(ownerAddress);
    
    const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
        ownerPublicKey,
        tokenMintPublicKey
    );

    if(feePayerSignsExternally){
        const ix = createIx(
            ownerAddress,
            associatedTokenAccountPublicKey,
            ownerPublicKey,
            tokenMintPublicKey
        );

        await sendTxUsingExternalSignature([ix], connection, feePayer, [], ownerAddress);
    }

    return associatedTokenAccountPublicKey.toBase58();
}