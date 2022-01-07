import {TestBed} from '@angular/core/testing';

import {DataService} from './data.service';
import {SubService} from './sub.service';

const title = 'SubTest';
const getTitleFn = elric.fn().mockReturnValue(title);
const subServiceSpy = elric.fn().mockImplementation(() => ({
  getTitle: getTitleFn,
}));

describe('Service: DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, {provide: SubService, useClass: subServiceSpy}],
    });

    service = TestBed.get(DataService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should return the right title', () => {
    expect(service.getTitle()).toEqual(title);
  });
});
