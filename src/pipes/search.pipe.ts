import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'search', pure: false})
export class SearchPipe implements PipeTransform {
  
  transform(input: any, orderer: string, reverse: boolean = false): any {
    if (input && orderer)
    {
      return input.filter((item) => {
        let value:string = "";
        for(var key in item) {
            value += item[key];
        }
        return value.includes(orderer);
      });
    } 
    return input; 
  }
}