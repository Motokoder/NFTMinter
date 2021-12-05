import { Nft } from "../models/Nft";

export default function NftListItem(props: {nft: Nft, editNft: (nft: Nft) => void}) {

  return (
    <>
      <div className="nft" onClick={() => props.editNft(props.nft)}>
        <div className="nft-image">
          {props.nft.externalUrl ?
            <a href={props.nft.externalUrl} target="_blank">
              <img src={props.nft.dataUrl}/>
            </a>
            :
            <img src={props.nft.dataUrl}/>
          }
        </div>
        <div className="nft-content">
            <>
              <h4>{props.nft.name}</h4>
              <p className="truncate-overflow">
                {props.nft.description}
              </p>
            </>
        </div>
      </div>
    </>
  );
}