import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestoptionsComponent } from './bestoptions.component';

describe('BestoptionsComponent', () => {
  let component: BestoptionsComponent;
  let fixture: ComponentFixture<BestoptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestoptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestoptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
