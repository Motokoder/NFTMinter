import { useEffect } from 'react';
import { loadWeb3, getNftCollections } from '../services/nft-factory-proxy';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setCollections,
  selectCollections,
} from '../app/collectionsSlice';
import CreateSmartContractDialog from './create-smart-contract-dialog';
import { Link } from 'react-router-dom';

export default function MyNFTs() {
  const dispatch = useAppDispatch();
  const nftCollections = useAppSelector(selectCollections);

  useEffect(() => {
    const init = async () => {
      const loadError = await loadWeb3();
      if (loadError) {
          alert(loadError);
          return;
      }

      const collections = await getNftCollections();
      dispatch(setCollections(collections));
    }

    init();
  }, []);

  return (
    <>
      <CreateSmartContractDialog/>

      {!!nftCollections.length &&
        <>
          <p>
            You have created {nftCollections.length} NFT Collections.
          </p>
          <ul>
            {nftCollections.map(nftCollection => 
              <li key={nftCollection.address}>
                <Link to={`/collection/${nftCollection.address}`}>
                  {nftCollection.name} ({nftCollection.symbol})
                </Link>
              </li>
            )}
          </ul>
        </>
      }
    </>
  );
}