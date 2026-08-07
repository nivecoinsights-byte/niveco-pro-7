import{describe,expect,it}from'vitest';import{calculateApplication,getStatus}from'./ipo';
describe('IPO utilities',()=>{it('calculates application capital',()=>expect(calculateApplication(2,30,450)).toEqual({shares:60,amount:27000}));it('identifies an open offer',()=>expect(getStatus({openDate:'2026-08-01',closeDate:'2026-08-10'},new Date('2026-08-07'))).toBe('Open'))})
