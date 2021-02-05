import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';
import BigNumber from 'bignumber.js';
import { parse } from 'path';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  swapsList: any;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, private utils: UtilsService) {
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
    this.swapsList = [];
  }

  // Gets both mask data and swap data for an ID
  async parseMask(id) {
    let mask = {};
    mask["id"] = id;
    let name = await this.contract.HMASK.methods.tokenNameByIndex(id).call();
    if (name === "") {
      name = "Unnamed";
    }
    mask["name"] = name;
    let shiftedId = (parseInt(id) + 10141)%16384;
    mask["imgURL"] = this.constants.imgURL + shiftedId + ".png";

    let swap = await this.contract.SWAPPER.methods.swapRecords(id).call();
    if (new BigNumber(swap["escrowedNCTAmount"]).eq(new BigNumber(this.constants.MODIFIED_PRICE))) {
      mask["type"] = "Name Swap";
      mask["name2"] = swap["name2"];
      mask["tokenPrice"] = "N/A";
      mask["token"] = "N/A";
    }
    else {
      mask["type"] = "Name Sale";
      mask["name2"] = "N/A"
      mask["tokenPrice"] = new BigNumber(swap["price"]).div(this.constants.PRECISION);
      mask["token"] = swap["token"];
    }
    return mask;
  }

  async loadData() {
    let swapIdList = await this.contract.SWAPPER.methods.getAllOpenSwaps().call();
    for (let id of swapIdList) {
      let swap = await this.parseMask(id);
      this.swapsList.push(swap);
    }
  }
}
