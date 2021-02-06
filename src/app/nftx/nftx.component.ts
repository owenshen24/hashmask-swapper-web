import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-nftx',
  templateUrl: './nftx.component.html',
  styleUrls: ['./nftx.component.css']
})
export class NftxComponent implements OnInit {

  xBalance: BigNumber;
  amount: any;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService)  { 
    this.resetData();
  }

  ngOnInit(): void {
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });
  }

  resetData() {
    this.xBalance = new BigNumber(0);
  }

  async loadData() {
    this.xBalance = new BigNumber(await this.contract.XHASH.methods.balanceOf(this.wallet.userAddress).call()).div(this.constants.PRECISION);
  }

  async redeem() {
    let amt = new BigNumber(this.amount);
    let func = this.contract.NFTX.methods.redeem(20, amt);
    await this.wallet.sendTxWithToken(func, this.contract.XHASH, this.constants.NFTX_MASTER_ADDRESS, amt, 400000, ()=>{}, ()=>{}, ()=>{});
  }

}
