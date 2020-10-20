export class FlightLeg {
   constructor(
      public readonly start: number,
      public readonly finish: number,
      public readonly isGround: boolean
      ) {
   }
}