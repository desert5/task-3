export class Airport {
   constructor(
      public readonly id: number = 0,
      public readonly name: string = "",
      public readonly city: string = "",
      public readonly country: string,
      public readonly iata: string,
      public readonly icao: string,
      public readonly latitude: number,
      public readonly longtitude: number,
      public readonly altitude: number,
      public readonly timezone: number,
      public readonly dst: string,
      public readonly timezoneTz: string,
      public readonly type: string,
      public readonly source: string
      ) {
   }
}