import { PublicKey, TransactionInstruction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection, COMMITMENT } from "../../Components/connection";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const findAssociatedTokenAccountPublicKey = async(
    ownerPublicKey,
    tokenMintPublicKey
) => 
    (
    await PublicKey.findProgramAddress(
      [
        ownerPublicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintPublicKey.toBuffer()
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
)[0];

const createIx = (
  funderPubkey,
  associatedTokenAccountPublicKey,
  ownerPublicKey,
  tokenMintPublicKey
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
  })


const sendTxUsingExternalSignature = async(
    instructions,
    connection,
    feePayer,
    signersExceptWallet,
    wallet //this is a public key
) => {

    let tx = new Transaction();
    tx.add(...instructions);
    tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

    tx.setSigners(
            ...(feePayer
            ? [(feePayer).publicKey, wallet] //change user
            : [wallet]), //change user
            ...signersExceptWallet.map(s => s.publicKey)
    );

    signersExceptWallet.forEach(acc => {
        tx.partialSign(acc);
    });

    const signedTransaction = await window.solana.signTransaction(tx);
    
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: COMMITMENT
    });

    console.log(signature);
}


export const createAssociatedTokenAccount = async(
    feePayerSecret, //Dont need
    feePayerSignsExternally, 
    tokenMintAddress,
    ownerAddress,
    payer //new
) => {
    const tokenMintPub = new PublicKey(tokenMintAddress); 
    const ownerPublicKey = new PublicKey(ownerAddress);
    const payerPub = new PublicKey(payer);
    
    const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
        ownerPublicKey,
        tokenMintPub,
    );

    if(feePayerSignsExternally){
        const ix = createIx(
            payerPub,
            associatedTokenAccountPublicKey,
            ownerPublicKey,
            tokenMintPub
        );
        
        await sendTxUsingExternalSignature([ix], connection, null, [], payerPub);
    }
}