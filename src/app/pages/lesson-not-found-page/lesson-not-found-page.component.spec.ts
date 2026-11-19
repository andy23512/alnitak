import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LessonNotFoundPageComponent } from './lesson-not-found-page.component';

describe('LessonNotFoundPageComponent', () => {
  it('shows a title and a description', () => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(LessonNotFoundPageComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent?.trim()).toBe(
      'lesson-not-found-page.title',
    );
    expect(el.querySelector('p')?.textContent?.trim()).toBe(
      'lesson-not-found-page.description',
    );
  });

  it('is a padded block', () => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(LessonNotFoundPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('block');
    expect(fixture.nativeElement.classList).toContain('p-5');
  });
});
