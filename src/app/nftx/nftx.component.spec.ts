import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftxComponent } from './nftx.component';

describe('NftxComponent', () => {
  let component: NftxComponent;
  let fixture: ComponentFixture<NftxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
