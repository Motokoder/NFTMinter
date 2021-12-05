import React, { useState, useEffect } from 'react';
import { loadWeb3, getNftCollection } from '../services/nft-factory-proxy';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setCurrentCollection,
  selectCurrentCollection,
  updateCurrentCollectionNfts,
  updateCurrentCollectionNft,
} from '../app/collectionsSlice';
import { useParams } from "react-router";
import { DropzoneArea } from 'material-ui-dropzone';
import { getAllNfts, saveNft, getNftById } from '../storage/media';
import { Nft } from '../models/Nft';
import NftListItem from './nft-list-item';
import EditNftDialog from './edit-nft-dialog';

export default function Collection() {
  let { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const currentCollection = useAppSelector(selectCurrentCollection);
  const [fileUploaderKey, setFileUploaderKey] = useState(0);
  const [isNftDialogOpen, setIsNftDialogOpen] = useState(false);
  const [nftForEdit, setNftForEdit] = useState<Nft>();

  useEffect(() => {
    const init = async () => {
      const loadError = await loadWeb3();
      if (loadError) {
        alert(loadError);
        return;
      }

      const collection = await getNftCollection(id);
      dispatch(setCurrentCollection(collection));

      const nfts = await getAllNfts(collection.address);
      dispatch(updateCurrentCollectionNfts(nfts));
    };

    init();

    return function cleanup() {
      dispatch(setCurrentCollection(null));
    };
  }, []);

  const imageUploadRef = React.useRef<any>();
  const imageRef = React.useRef<any>();

  function upload(files: any[]) {
    // Get the file objects that was selected by the user from myinput - a file picker control
    if (files.length > 0) {

      for (var i = 0; i < files.length; i++) {
        var imageUpload = files[i];

        console.log(i);
        console.log(imageUpload);

        readFile(imageUpload, `mp4-${i}`);

        setFileUploaderKey(fileUploaderKey + 1);
      }
    }
  }

  const readFile = (imageFile: any, mp4Id: any) => {
    let fileReader = new FileReader();
    let fileName = '';

    fileReader.onload = async (fileLoadedEvent: any) => {
      var dataUrl = fileLoadedEvent.target.result;

      console.log('*** dataUrl ***');
      console.log(dataUrl);

      if (currentCollection?.address) {
        let nft: Nft = {
          collectionAddress: currentCollection.address,
          name: fileName,
          dataUrl: dataUrl
        };

        await saveNft(nft);

        const nfts = await getAllNfts(currentCollection.address);
        dispatch(updateCurrentCollectionNfts(nfts));
      }

      //mp4
      // console.log(mp4Id);
      // var mp4: any = document.getElementById(mp4Id);
      // mp4.src = srcData;

    }

    console.log('*** imageFile ***');
    console.log(imageFile);

    //get the file name without extension and replace dots with spaces
    fileName = imageFile.name.split('.').slice(0, -1).join(' ');
    fileReader.readAsDataURL(imageFile);
  };

  const editNft = (nft: Nft) => {
    setNftForEdit(nft);
    setIsNftDialogOpen(true);
  }

  const saveNftEditDialog = async (editedNft: Partial<Nft>) => {
    try {
        if (nftForEdit && editedNft) {
            const nftToSave = { ...nftForEdit, ...editedNft };
            if (nftToSave.id) {
              await saveNft(nftToSave);
              const savedNft = await getNftById(nftToSave.id);
              if (savedNft) {
                dispatch(updateCurrentCollectionNft(savedNft))
              }
            }
        }
        setIsNftDialogOpen(false);
    } catch (err) {
        console.log(`error handler:`);
        console.log(err);
        alert(err);
    }
};

  const closeNftDialog = () => {
    setIsNftDialogOpen(false);
  };

  return (
    <>
      {currentCollection &&
        <>
          <h2>{currentCollection.name} ({currentCollection.symbol})</h2>
          <div className="copy-contract-addr">
            <a href="javascript:void(0)" onClick={e => { navigator.clipboard.writeText(currentCollection.address) }}>
              Copy Contract Address
            </a>
          </div>
        </>
      }

      <div className="nft-container">
        <DropzoneArea key={'dz' + fileUploaderKey} onChange={upload} filesLimit={100} showPreviews={false} showPreviewsInDropzone={false} maxFileSize={20_971_520}
          dropzoneText="Click here to add your NFT media files. You may also drag and drop them."
          acceptedFiles={[".jpg", ".jpeg", ".png", ".gif", ".svg", '.mp3', '.wav', '.oga', '.webm', '.mp4', '.m4v', '.ogv', '.ogg']}
        />
        {currentCollection?.nfts?.map((nft, ix) =>
          <NftListItem key={nft.id || ix} nft={nft} editNft={editNft}></NftListItem>
        )}
      </div>
      {nftForEdit &&
        <EditNftDialog nft={nftForEdit} isOpen={isNftDialogOpen} save={saveNftEditDialog} close={closeNftDialog} />
      }
    </>
  );
}