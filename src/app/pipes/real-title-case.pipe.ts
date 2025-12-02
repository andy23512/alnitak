import { Pipe, PipeTransform } from '@angular/core';
import { toTitleCase } from '../utils/case.utils';

/**
 * Real title case transformation pipe (ignoring some stop words)
 * (Add real to distinguish with angular built-in one)
 *
 * @export
 * @class RealTitleCasePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'realTitleCase',
  standalone: true,
})
export class RealTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return toTitleCase(value);
  }
}
