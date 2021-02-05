import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.css']
})
export class MaskComponent implements OnInit {

  maskId: any;
  maskData: any;
  tokenAddress: any;
  tokenAmount: any;
  desiredName: any;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, private utils: UtilsService, private activatedRoute: ActivatedRoute) {
    this.resetData();
  }

  ngOnInit(): void {
    this.maskId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });

    this.activatedRoute.params.subscribe(routeParams => {
      this.maskId = routeParams.id;
      if (this.wallet.connected) {
        this.loadData();
      }
    });
  }

  resetData() {
    this.maskData = {
      "id": "",
      "name": "",
      "imgURL": "",
      "owner": ""
    }
  }

  async loadData() {
    if (window[this.maskId + "_data"] !== undefined) {
      this.maskData = window[this.maskId + "_data"];
    }
    else {
      let mask = {};
      mask["id"] = this.maskId;
      let name = await this.contract.HMASK.methods.tokenNameByIndex(this.maskId).call();
      if (name === "") {
        name = "Unnamed";
      }
      mask["name"] = name;
      mask["owner"] = await this.contract.HMASK.methods.ownerOf(this.maskId).call();
      let shiftedId = (parseInt(this.maskId) + 10141)%16384;
      mask["imgURL"] = this.constants.imgURL + shiftedId + ".png";
      window[this.maskId + "_data"] = mask;
      this.maskData = mask;
    }
  }

  async wrapMask() {
    const func = this.contract.NFTX.methods.mint(
      20,
      this.maskId,
      0
    );
    await this.wallet.sendTxWithNFT(func, this.contract.HMASK, this.constants.NFTX_MASTER_ADDRESS, 500000, () => {}, () => {}, () => {});
  }

  async swapMask() {
    const func = this.contract.SWAPPER.methods.setNameSwap(this.maskId, this.desiredName);
    await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () => {}, () => {}, () => {});
  }

  isOwned() {
    if (this.wallet.userAddress !== null) {
      return (this.maskData["owner"].toLowerCase() === this.wallet.userAddress.toLowerCase());
    }
    else {
      return false;
    }
  }
}
