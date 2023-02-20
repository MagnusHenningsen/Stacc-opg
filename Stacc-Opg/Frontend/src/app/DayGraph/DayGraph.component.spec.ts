import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayGraphComponent } from './DayGraph.component';

describe('GraphComponent', () => {
  let component: DayGraphComponent;
  let fixture: ComponentFixture<DayGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
