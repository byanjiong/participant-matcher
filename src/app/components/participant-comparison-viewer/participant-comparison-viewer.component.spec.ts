import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantComparisonViewerComponent } from './participant-comparison-viewer.component';

describe('ParticipantComparisonViewerComponent', () => {
  let component: ParticipantComparisonViewerComponent;
  let fixture: ComponentFixture<ParticipantComparisonViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantComparisonViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantComparisonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
