import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  
  PRECISION = 1e18;
  MODIFIED_PRICE = 2745000000000000000000;
  
  // Mainnet addresses
  NCT_ADDRESS = '0x8A9c4dfe8b9D8962B31e4e16F8321C44d48e246E';
  NFT_AGGREGATOR_ADDRESS = '0xF83eEE39E723526605d784917b6e38ebCF0f0207';
  HMASKS_ADDRESS = '0xc2c747e0f7004f9e8817db2ca4997657a7746928';
  SWAPPER_ADDRESS = '0x078d3B62e82b5CEe3ebdC0754cda976230517452';
  MULTICALL_ADDRESS = '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441';
  NFTX_MASTER_ADDRESS = '0xAf93fCce0548D3124A5fC3045adAf1ddE4e8Bf7e';
  XHASH_TOKEN_ADDRESS = '0x0fe629d1e84e171f8ff0c1ded2cc2221caa48a3f';

  imgURL = "https://hashmasksstore.blob.core.windows.net/hashmaskspreview/";
}