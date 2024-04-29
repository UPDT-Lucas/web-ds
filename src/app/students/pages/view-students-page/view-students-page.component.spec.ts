import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentsPageComponent } from './view-students-page.component';

describe('ViewStudentsPageComponent', () => {
  let component: ViewStudentsPageComponent;
  let fixture: ComponentFixture<ViewStudentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudentsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewStudentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
