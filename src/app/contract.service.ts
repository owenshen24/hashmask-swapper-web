import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public wallet: WalletService, public constants: ConstantsService) { 
  }

  public get NCT() {
    const abi = require('../assets/abi/NCT.json');
    const address = this.constants.NCT_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get MULTICALL() {
    const abi = require('../assets/abi/Multicall.json');
    const address = this.constants.MULTICALL_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get NFT_AGG() {
    const abi = require('../assets/abi/NFTAggregator.json');
    const address = this.constants.NFT_AGGREGATOR_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get HMASK() {
    const abi = require('../assets/abi/HMasks.json');
    const address = this.constants.HMASKS_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get SWAPPER() {
    const abi = require('../assets/abi/Swapper.json');
    const address = this.constants.SWAPPER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get NFTX() {
    const abi = require('../assets/abi/NFTX.json');
    const address = this.constants.NFTX_MASTER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }
  
  public get XHASH() {
    const abi = require('../assets/abi/ERC20Detailed.json');
    const address = this.constants.XHASH_TOKEN_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }
  
  public ERC20(address) {
    const abi = require('../assets/abi/ERC20Detailed.json');
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  async loadData() {
  }
}
