import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatTestComponent } from './stat-test.component';

describe('StatTestComponent', () => {
  let component: StatTestComponent;
  let fixture: ComponentFixture<StatTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
