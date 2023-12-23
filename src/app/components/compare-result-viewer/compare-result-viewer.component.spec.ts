import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareResultViewerComponent } from './compare-result-viewer.component';

describe('CompareResultViewerComponent', () => {
  let component: CompareResultViewerComponent;
  let fixture: ComponentFixture<CompareResultViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareResultViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompareResultViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
