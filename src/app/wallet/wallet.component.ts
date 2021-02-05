import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  masksList: any;
  loading: boolean;

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
    this.masksList = [];
    this.loading = true;
  }

  async loadData() {
    if (window["masksList"] !== undefined) {
      this.masksList = window["masksList"];
    }
    else {
      let maskIds = await this.contract.NFT_AGG.methods.getIds(this.constants.HMASKS_ADDRESS, this.wallet.userAddress).call();
      for (let id of maskIds) {
        let mask = {};
        mask["id"] = id;
        let name = await this.contract.HMASK.methods.tokenNameByIndex(id).call();
        if (name === "") {
          name = "Unnamed";
        }
        mask["name"] = name;
        mask["owner"] = this.wallet.userAddress;
        let shiftedId = (parseInt(id) + 10141)%16384;
        mask["imgURL"] = this.constants.imgURL + shiftedId + ".png";
        this.masksList.push(mask);
        window[id + "_data"] = mask;
      }
      window["masksList"] = this.masksList;
    }
    this.loading = false;
  }

}
