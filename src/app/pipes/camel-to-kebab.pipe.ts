import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToKebab',
  standalone: true,
})
export class CamelToKebabPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase());
  }
}
