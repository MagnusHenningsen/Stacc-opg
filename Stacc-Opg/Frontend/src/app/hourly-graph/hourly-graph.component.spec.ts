import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyGraphComponent } from './hourly-graph.component';

describe('HourlyGraphComponent', () => {
  let component: HourlyGraphComponent;
  let fixture: ComponentFixture<HourlyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourlyGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
