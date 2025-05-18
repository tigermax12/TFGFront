import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeOrdenComponent } from './informe-orden.component';

describe('InformeOrdenComponent', () => {
  let component: InformeOrdenComponent;
  let fixture: ComponentFixture<InformeOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeOrdenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
