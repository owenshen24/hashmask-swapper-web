import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WalletComponent } from './wallet/wallet.component';
import { MaskComponent } from './mask/mask.component';
import { SwapComponent } from './swap/swap.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AllComponent } from './all/all.component';
import { NftxComponent } from './nftx/nftx.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WalletComponent,
    MaskComponent,
    SwapComponent,
    FooterComponent,
    HomeComponent,
    AllComponent,
    NftxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
