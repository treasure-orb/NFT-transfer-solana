import React , { Fragment, useState, useEffect } from 'react'
import {
  TextField, Button, Tooltip,   
} from "@material-ui/core"
import "./Form.css"
import InfoIcon from '@material-ui/icons/Info';
import {transferTokenHandler} from './transferToken'

const TransferForm = () =>{
    const [owner,setOwner] = useState("");
    const [destination,setDestination] = useState("");
    const [tokenMint,setTokenMint] = useState("");
    const [pubKey, setPubKey] = useState();

    useEffect(()=> {
getConnectedWallet();
connectWallet();
    },[])

    const handleSubmit = () =>{
        console.log("handle submit Clicked")
    }

const getConnectedWallet = async()=> {    
    const provider = await window.solana;
    if(provider){
        setPubKey(provider.publicKey);
        console.log("Is Phantom installed?  ", provider.isPhantom);
        //return provider;
    }
    else console.log("Try to connect again");
}
//var ownerkey = await getConnectedWallet();
var amount = 1;



const connectWallet = async() => {
    const provider = window.solana;
    console.log(provider);
    if(provider){
            //setCount(count + 1);
            await window.solana.connect();
            window.solana.on("connect", () => console.log("connect"));
            getConnectedWallet();
        }
    else window.open("https://phantom.app/", "_blank")
}


return <Fragment className="container" >
<div className="field" >
    <TextField variant="outlined" 
    label="Owner Address" 
    placeholder="Enter owner address"
    value={owner}
    onChange={(e)=> setOwner(e.target.value) }
    fullWidth
    />
</div>
<div className="field" >
    <TextField variant="outlined" 
    label="Destintion Address" 
    placeholder="Enter Destination Address" 
    value={destination}
    onChange={(e)=> setDestination(e.target.value) }
    fullWidth
    />
</div>
<div className="field" >
    <TextField variant="outlined" 
    label="Token Mint Address" 
    placeholder="Enter Token Mint Address" 
    value={tokenMint}
    onChange={(e)=> setTokenMint(e.target.value) }
    fullWidth
    InputProps={{
        endAdornment:
        <Tooltip title={<div style={{ fontSize:'16px', padding:"4px" }}>{`Phantom Wallet -> Collectibles -> NFT -> Open in explorer -> Copy "Mint address" `}</div>}>
        <InfoIcon style={{color : "blue"}} />
        </Tooltip>

    }}
    />
    </div>
<div className="btn" >
    <Button variant="contained" color="primary" onClick={() => transferTokenHandler(owner, destination, tokenMint, amount, owner)}>Transfer</Button>
</div>
</Fragment>

}

export default TransferForm