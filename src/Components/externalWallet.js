import { Transaction } from "@solana/web3.js"
import { COMMITMENT } from './connection'

export const sendTxUsingExternalSignature = async(
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