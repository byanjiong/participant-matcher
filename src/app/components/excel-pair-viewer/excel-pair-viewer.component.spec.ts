import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelPairViewerComponent } from './excel-pair-viewer.component';

describe('ExcelPairViewerComponent', () => {
  let component: ExcelPairViewerComponent;
  let fixture: ComponentFixture<ExcelPairViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelPairViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelPairViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
