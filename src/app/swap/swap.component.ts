import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.css']
})
export class SwapComponent implements OnInit {

  masksList: any;
  maskId: any;
  maskData: any;
  swapData: any;
  selectedMask: any;
  tokenPrice: BigNumber;

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
    };
    this.swapData = {
      "type": ""
    };
    this.masksList = [];
    this.tokenPrice = new BigNumber(0);
  }

  async parseMask(id) {
    let mask = {};
    mask["id"] = id;
    let name = await this.contract.HMASK.methods.tokenNameByIndex(id).call();
    if (name === "") {
      name = "Unnamed";
    }
    mask["name"] = name;
    mask["owner"] = await this.contract.HMASK.methods.ownerOf(id).call();
    let shiftedId = (parseInt(id) + 10141)%16384;
    mask["imgURL"] = this.constants.imgURL + shiftedId + ".png";
    return mask;
  }

  async loadData() {

    // Get value about current swap
    if (window[this.maskId + "_swap"] !== undefined) {
      this.swapData = window[this.maskId + "_swap"]
    }
    else {
      let swap = await this.contract.SWAPPER.methods.swapRecords(this.maskId).call();
      if (new BigNumber(swap["escrowedNCTAmount"]).eq(new BigNumber(this.constants.MODIFIED_PRICE))) {
        swap["type"] = "Name Swap";
      }
      else {
        swap["type"] = "Name Sale";
      }
      this.tokenPrice = new BigNumber(swap["price"]).div(this.constants.PRECISION);
      window[this.maskId + "_swap"] = swap;
      this.swapData = swap;
    }

    // Get value about current mask
    if (window[this.maskId + "_data"] !== undefined) {
      this.maskData = window[this.maskId + "_data"];
    }
    else {
      let mask = await this.parseMask(this.maskId);
      window[this.maskId + "_data"] = mask;
      this.maskData = mask;
    }

    // Get masksList
    if (window["masksList"] !== undefined) {
      this.masksList = window["masksList"];
    }
    else {
      let maskIds = await this.contract.NFT_AGG.methods.getIds(this.constants.HMASKS_ADDRESS, this.wallet.userAddress).call();
      for (let id of maskIds) {
        let mask = await this.parseMask(id);
        this.masksList.push(mask);
        window[id + "_data"] = mask;
      }
      window["masksList"] = this.masksList;
    }
  }

  async takeSwap() {
    let func = this.contract.SWAPPER.methods.takeSwap(this.maskId, this.selectedMask, this.utils.randomName());
    await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () =>{}, () =>{}, () =>{});
  }

  async takeSale() {
    let func = this.contract.SWAPPER.methods.takeSell(this.maskId, this.selectedMask, this.utils.randomName());
    let token = this.contract.ERC20(this.swapData["token"]);
    const maxAllowance = new BigNumber(2).pow(256).minus(1).integerValue().toFixed();
    const allowance = new BigNumber(await token.methods.allowance(this.wallet.userAddress, this.constants.SWAPPER_ADDRESS).call());
    if (allowance.gte(this.tokenPrice.multipliedBy(this.constants.PRECISION))) {
      await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () =>{}, () =>{}, () =>{}); 
    }
    else {
      return this.wallet.sendTx(token.methods.approve(this.constants.SWAPPER_ADDRESS, maxAllowance), async() => {
        await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () =>{}, () =>{}, () =>{});
      }, ()=>{}, ()=>{});
    }
  }

  async removeSwap() {
    let func = this.contract.SWAPPER.methods.removeSwap(this.maskId);
    await this.wallet.sendTx(func, () => {}, () => {}, () => {});
  }

  isSwap() {
    return this.swapData["type"] === "Name Swap";
  }

  isSale() {
    return this.swapData["type"] === "Name Sale";
  }
}
