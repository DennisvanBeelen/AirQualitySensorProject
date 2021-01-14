import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphOfOneSensorComponent } from './line-graph-of-one-sensor.component';

describe('LineGraphOfOneSensorComponent', () => {
  let component: LineGraphOfOneSensorComponent;
  let fixture: ComponentFixture<LineGraphOfOneSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineGraphOfOneSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphOfOneSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
