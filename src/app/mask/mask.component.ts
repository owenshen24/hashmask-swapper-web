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
  symbol: any;
  tokenLogo: any;

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
    this.symbol = "";
    this.maskId = this.activatedRoute.snapshot.paramMap.get('id');
    let shiftedId = (parseInt(this.maskId) + 10141)%16384;
    this.maskData["imgURL"] = this.constants.imgURL + shiftedId + ".png";
  }

  async loadData() {
    if (window[this.maskId + "_data"] !== undefined) {
      this.maskData = window[this.maskId + "_data"];
    }
    else {
      this.maskData["id"] = this.maskId;
      let name = await this.contract.HMASK.methods.tokenNameByIndex(this.maskId).call();
      if (name === "") {
        name = "Unnamed";
      }
      this.maskData["name"] = name;
      this.maskData["owner"] = await this.contract.HMASK.methods.ownerOf(this.maskId).call();
      window[this.maskId + "_data"] = this.maskData;
    }
  }

  async wrapMask() {
    const func = this.contract.NFTX.methods.mint(
      20,
      [this.maskId],
      0
    );
    await this.wallet.sendTxWithNFT(func, this.contract.HMASK, this.constants.NFTX_MASTER_ADDRESS, 500000, () => {}, () => {}, () => {});
  }

  async swapMask() {
    const func = this.contract.SWAPPER.methods.setNameSwap(this.maskId, this.desiredName);
    await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () => {}, () => {}, () => {});
  }

  async sellMask() {
    let amount = new BigNumber(this.tokenAmount).multipliedBy(this.constants.PRECISION);
    let func = this.contract.SWAPPER.methods.setNameSale(this.maskId, this.tokenAddress, amount);
    let token = this.contract.ERC20(this.tokenAddress);
    let maxAllowance = new BigNumber(2).pow(256).minus(1).integerValue().toFixed();
    let allowance = new BigNumber(await token.methods.allowance(this.wallet.userAddress, this.constants.SWAPPER_ADDRESS).call());
    if (allowance.gt(0)) {
      if (allowance.gte(amount)) {
        await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () => {}, () => {}, () => {});
      }
    }
    else {
      return this.wallet.sendTx(token.methods.approve(this.constants.SWAPPER_ADDRESS, maxAllowance), async() => {
        await this.wallet.sendTxWithTokenAndNFT(func, this.contract.NCT, this.contract.HMASK, this.constants.SWAPPER_ADDRESS, this.constants.MODIFIED_PRICE, 500000, () =>{}, () =>{}, () =>{});
      }, ()=>{}, ()=>{});
    }
  }

  async getToken() {
    let tokenList = require("../../assets/token-list.json");
    tokenList = tokenList["tokens"];
    for (let t of tokenList) {
      if (t["address"].toLowerCase() == this.tokenAddress.toLowerCase()) {
        this.symbol = t["symbol"];
        this.tokenLogo = t["logoURI"];
        return;
      }
    }
    let token = this.contract.ERC20(this.tokenAddress);
    this.symbol = await token.methods.symbol().call();
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
