import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { HomeComponent } from './home/home.component';
import { MaskComponent } from './mask/mask.component';
import { NftxComponent } from './nftx/nftx.component';
import { SwapComponent } from './swap/swap.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  {
    path: 'wallet',
    component: WalletComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'mask/:id',
    component: MaskComponent
  },
  {
    path: 'swap/:id',
    component: SwapComponent
  },
  {
    path: 'all',
    component: AllComponent
  },
  {
    path: 'nftx',
    component: NftxComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
