let wallet;
let fileBuffer;
let address = '';
let balance = 0;

//Intialize Arweave
const arweave = Arweave.init({
    host: 'arweave.net', // Hostname or IP address for a Arweave host
    port: 443,           // Port
    protocol: 'https',   // Network protocol http or https
    timeout: 20000,      // Network request timeouts in milliseconds
    logging: false,      // Enable network request logging
});

arweave.network.getInfo().then(network => {
    document.getElementById('arweaveNetwork').innerText = `Arweave network: ${JSON.stringify(network)}`;
});

let txId = '';

createTx = async () => {

    //Create a new wallet
    //When generating a wallet, files can be uploaded to arweave and cached at the gateway.
    //The cache will last at least a couple of days which is great for testing.
    //let wallet = await arweave.wallets.generate();

    //Create
    let transaction = await arweave.createTransaction({
        data: fileBuffer
    }, wallet);

    transaction.addTag('Content-Type', 'image/png');

    //Sign
    await arweave.transactions.sign(transaction, wallet);

    //Submit
    let uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    txId = transaction.id;
    console.log(txId);

    const image = document.getElementById('image');
    image.src = `https://arweave.net/${txId}`;
}

getTxData = () => {
    // Get the data decode as string data
    arweave.transactions.getData(txId, {decode: false, string: false}).then(data => {
        console.log(data);
    });
}

function readKeyFile(keyFile) {
  var files = document.getElementById('keyFile').files;

  if (files.length > 0) {
    var keyFile = files[0];

    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      wallet = JSON.parse(e.target.result);
      console.log('Wallet:');
      console.log(wallet);

      address = await arweave.wallets.jwkToAddress(wallet);
      document.getElementById('arweaveAddress').innerText = `Arweave address: ${address}`;
      console.log(`wallet address: ${address}`);
      
      balance = await arweave.wallets.getBalance(address);
      document.getElementById('arweaveBalance').innerText = `Arweave balance: ${balance}`;
      console.log(`balance: ${balance}`);
    }

    fileReader.readAsText(keyFile);
  }
}

function readFile(imageFile) {
  var files = document.getElementById("imageFile").files;
  if (files.length > 0) {
      var imageFile = files[0];

      var fileReader = new FileReader();

      fileReader.onload = (e) => {
          fileBuffer = e.target.result;
      }

      fileReader.readAsArrayBuffer(imageFile);
  }
}