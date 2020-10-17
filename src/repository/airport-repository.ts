const parse = require('csv-parse')
const fs = require('fs').promises;
import {Airport} from "../model/airport"

export class AirportRepository {

    private readonly store: Array<Airport>;

    constructor() {
      let dummyData= [
          new Airport(1,"Goroka Airport","Goroka","Papua New Guinea","GKA","AYGA",-6.081689834590001,145.391998291,5282,10,"U","Pacific/Port_Moresby","airport","OurAirports"                                         ),
          new Airport(2,"Madang Airport","Madang","Papua New Guinea","MAG","AYMD",-5.20707988739,145.789001465,20,10,"U","Pacific/Port_Moresby","airport","OurAirports"                                               ),
          new Airport(3,"Mount Hagen Kagamuga Airport","Mount Hagen","Papua New Guinea","HGU","AYMH",-5.826789855957031,144.29600524902344,5388,10,"U","Pacific/Port_Moresby","airport","OurAirports"                 ),
          new Airport(4,"Nadzab Airport","Nadzab","Papua New Guinea","LAE","AYNZ",-6.569803,146.725977,239,10,"U","Pacific/Port_Moresby","airport","OurAirports"                                                      ),
          new Airport(5,"Port Moresby Jacksons International Airport","Port Moresby","Papua New Guinea","POM","AYPY",-9.443380355834961,147.22000122070312,146,10,"U","Pacific/Port_Moresby","airport","OurAirports"  ),
          new Airport(6,"Wewak International Airport","Wewak","Papua New Guinea","WWK","AYWK",-3.58383011818,143.669006348,19,10,"U","Pacific/Port_Moresby","airport","OurAirports"                                   ),
          new Airport(7,"Narsarsuaq Airport","Narssarssuaq","Greenland","UAK","BGBW",61.1604995728,-45.4259986877,112,-3,"E","America/Godthab","airport","OurAirports"                                                ),
          new Airport(8,"Godthaab / Nuuk Airport","Godthaab","Greenland","GOH","BGGH",64.19090271,-51.6781005859,283,-3,"E","America/Godthab","airport","OurAirports"                                                 ),
          new Airport(9,"Kangerlussuaq Airport","Sondrestrom","Greenland","SFJ","BGSF",67.0122218992,-50.7116031647,165,-3,"E","America/Godthab","airport","OurAirports"                                              ),
          new Airport(10,"Thule Air Base","Thule","Greenland","THU","BGTL",76.5311965942,-68.7032012939,251,-4,"E","America/Thule","airport","OurAirports"                                                            ),
          new Airport(11,"Akureyri Airport","Akureyri","Iceland","AEY","BIAR",65.66000366210938,-18.07270050048828,6,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                               ),
          new Airport(12,"Egilsstaðir Airport","Egilsstadir","Iceland","EGS","BIEG",65.2833023071289,-14.401399612426758,76,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                        ),
          new Airport(13,"Hornafjörður Airport","Hofn","Iceland","HFN","BIHN",64.295601,-15.2272,24,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                                                ),
          new Airport(14,"Húsavík Airport","Husavik","Iceland","HZK","BIHU",65.952301,-17.426001,48,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                                                ),
          new Airport(15,"Ísafjörður Airport","Isafjordur","Iceland","IFJ","BIIS",66.05809783935547,-23.135299682617188,8,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                          ),
          new Airport(16,"Keflavik International Airport","Keflavik","Iceland","KEF","BIKF",63.985000610352,-22.605600357056,171,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                   ),
          new Airport(17,"Patreksfjörður Airport","Patreksfjordur","Iceland","PFJ","BIPA",65.555801,-23.965,11,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                                     ),
          new Airport(18,"Reykjavik Airport","Reykjavik","Iceland","RKV","BIRK",64.1299972534,-21.9405994415,48,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                                    ),
          new Airport(19,"Siglufjörður Airport","Siglufjordur","Iceland","SIJ","BISI",66.133301,-18.9167,10,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                                        ),
          new Airport(20,"Vestmannaeyjar Airport","Vestmannaeyjar","Iceland","VEY","BIVM",63.42430114746094,-20.278900146484375,326,0,"N","Atlantic/Reykjavik","airport","OurAirports"                                ),
          new Airport(21,"Sault Ste Marie Airport","Sault Sainte Marie","Canada","YAM","CYAM",46.48500061035156,-84.5093994140625,630,-5,"A","America/Toronto","airport","OurAirports"                                ),
          new Airport(22,"Winnipeg / St. Andrews Airport","Winnipeg","Canada",null,"CYAV",50.0564002991,-97.03250122070001,760,-6,"A","America/Winnipeg","airport","OurAirports"                                        ),
          new Airport(23,"Halifax / CFB Shearwater Heliport","Halifax","Canada",null,"CYAW",44.639702,-63.499401,144,-4,"A","America/Halifax","airport","OurAirports"                                                   ),
          new Airport(24,"St. Anthony Airport","St. Anthony","Canada","YAY","CYAY",51.3918991089,-56.083099365200006,108,-3.5,"A","America/St_Johns","airport","OurAirports"                                          ),
          new Airport(25,"Tofino / Long Beach Airport","Tofino","Canada","YAZ","CYAZ",49.079833,-125.775583,80,-8,"A","America/Vancouver","airport","OurAirports"                                                     ),
          new Airport(26,"Kugaaruk Airport","Pelly Bay","Canada","YBB","CYBB",68.534401,-89.808098,56,-7,"A","America/Edmonton","airport","OurAirports"                                                               ),
          new Airport(27,"Baie Comeau Airport","Baie Comeau","Canada","YBC","CYBC",49.13249969482422,-68.20439910888672,71,-5,"A","America/Toronto","airport","OurAirports"                                           ),
          new Airport(28,"CFB Bagotville","Bagotville","Canada","YBG","CYBG",48.33060073852539,-70.99639892578125,522,-5,"A","America/Toronto","airport","OurAirports"                                                ),
          new Airport(29,"Baker Lake Airport","Baker Lake","Canada","YBK","CYBK",64.29889678960001,-96.077796936,59,-6,"A","America/Winnipeg","airport","OurAirports"                                                 ),
          new Airport(30,"Campbell River Airport","Campbell River","Canada","YBL","CYBL",49.950801849365234,-125.27100372314453,346,-8,"A","America/Vancouver","airport","OurAirports"                                ),
          new Airport(31,"Brandon Municipal Airport","Brandon","Canada","YBR","CYBR",49.91,-99.951897,1343,-6,"A","America/Winnipeg","airport","OurAirports"                                                          ),
          new Airport(32,"Cambridge Bay Airport","Cambridge Bay","Canada","YCB","CYCB",69.1081008911,-105.138000488,90,-7,"A","America/Edmonton","airport","OurAirports"                                              ),
          new Airport(33,"Nanaimo Airport","Nanaimo","Canada","YCD","CYCD",49.054970224899996,-123.869862556,92,-8,"A","America/Vancouver","airport","OurAirports"                                                    ),
          new Airport(34,"Castlegar/West Kootenay Regional Airport","Castlegar","Canada","YCG","CYCG",49.2963981628,-117.632003784,1624,-8,"A","America/Vancouver","airport","OurAirports"                            ),
          new Airport(35,"Miramichi Airport","Chatham","Canada","YCH","CYCH",47.007801,-65.449203,108,-4,"A","America/Halifax","airport","OurAirports"                                                                ),
          new Airport(36,"Charlo Airport","Charlo","Canada","YCL","CYCL",47.990799,-66.330299,132,-4,"A","America/Halifax","airport","OurAirports"                                                                    ),
          new Airport(37,"Kugluktuk Airport","Coppermine","Canada","YCO","CYCO",67.816704,-115.143997,74,-7,"A","America/Edmonton","airport","OurAirports"                                                            ),
          new Airport(38,"Coronation Airport","Coronation","Canada","YCT","CYCT",52.0750007629,-111.444999695,2595,-7,"A","America/Edmonton","airport","OurAirports"                                                  ),
          new Airport(39,"Chilliwack Airport","Chilliwack","Canada","YCW","CYCW",49.1528015137,-121.939002991,32,-8,"A","America/Vancouver","airport","OurAirports"                                                   ),
          new Airport(40,"Clyde River Airport","Clyde River","Canada","YCY","CYCY",70.4860992432,-68.5167007446,87,-5,"A","America/Toronto","airport","OurAirports"                                                   )
       ]

       this.store = dummyData
    }

    getById(id: number) {
        return this.store.find((x: Airport) => x.id == id)
    }

    getAirports() {
        return this.store
    }

/*
    fromCSV(file: string) {
        let rows: Array<Airport> = []
        const content = await fs.readFile(file)
        // Create the parser
        const parser = parse(content)
        // Use the readable stream api
        parser.on('readable', function(){
          let record
          while (record = parser.read()) {
            console.log(record)
            rows.push(new Airport(parseInt(record[0]), record[1], record[2], record[4], record[5]))
          }
        })
        // Catch any error
        parser.on('error', function(err: any){
          console.error(err.message)
        })
        // When we are done, test that the parsed output matched what expected
        parser.on('end', () => console.log("CSV import completed from " + file))
        // Close the readable stream
        parser.end()

        return rows
    }
*/
}