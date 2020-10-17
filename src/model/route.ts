/*
   Airline	2-letter (IATA) or 3-letter (ICAO) code of the airline.
   Airline ID	Unique OpenFlights identifier for airline (see Airline).
   Source airport	3-letter (IATA) or 4-letter (ICAO) code of the source airport.
   Source airport ID	Unique OpenFlights identifier for source airport (see Airport)
   Destination airport	3-letter (IATA) or 4-letter (ICAO) code of the destination airport.
   Destination airport ID	Unique OpenFlights identifier for destination airport (see Airport)
   Codeshare	"Y" if this flight is a codeshare (that is, not operated by Airline, but another carrier), empty otherwise.
   Stops	Number of stops on this flight ("0" for direct)
   Equipment	3-letter codes for plane type(s) generally used on this flight, separated by spaces
*/

export class Route {
   constructor(
      public readonly airline: string,
      public readonly airlineId: number,
      public readonly sourceAirport: string,
      public readonly sourceAirportId: number,
      public readonly destinationAirport: string,
      public readonly destinationAirportId: number,
      public readonly codeShare: string,
      public readonly stops: number,
      public readonly equipment: string
      ) {
   }
}