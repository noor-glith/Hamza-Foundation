/* ===== Hospital data (single source of truth) ===== */
const BRANCH = {
  name: "Hamza Foundation Hospital",
  subtitle: "Amin Hayat Memorial Medical Center, Pakki Thatti",
  address: "Al-Mumtaz Road, Pakki Thatti, Samanabad, Lahore 54000",
  plusCode: "G7JV+C46",
  // Exact centre of plus code 8J3PG7JV+C46
  latitude: 31.5310375, longitude: 74.2927656,
  phone: "+924237581146",
  email: "info@hamzafoundation.org",
  // Source: hamzafoundation.org medical wing page. 0=Sun..6=Sat, Asia/Karachi time. null = closed / not listed
  hours: {0:null, 1:["08:00","14:00"], 2:["08:00","14:00"], 3:["08:00","14:00"], 4:["08:00","14:00"], 5:["08:00","12:00"], 6:["08:00","14:00"]}
};

const AREAS = [
  ["Johar Town",31.4697,74.2728,["johar"]],["Gulberg",31.5106,74.3452,["gulberg iii","liberty"]],["Model Town",31.4833,74.3237,[]],
  ["Garden Town",31.5020,74.3230,[]],["DHA",31.4700,74.4050,["defence","dha phase 5"]],["Allama Iqbal Town",31.5120,74.2860,["iqbal town"]],
  ["Township",31.4500,74.3050,[]],["Faisal Town",31.4800,74.3040,[]],["Wapda Town",31.4330,74.2660,["wapda"]],
  ["Shadman",31.5400,74.3300,[]],["Mall Road",31.5650,74.3130,["the mall","anarkali"]],["Samanabad",31.5330,74.2950,[]],
  ["Cantt",31.5200,74.3950,["cantonment"]],["Bahria Town",31.3700,74.1800,["bahria"]],["Walled City",31.5820,74.3170,["androon","delhi gate"]],
  ["Green Town",31.4380,74.3000,[]],["Ichhra",31.5230,74.3150,[]],["Valencia",31.4000,74.2500,[]],["Shahdara",31.6200,74.2830,[]],
  ["Pakki Thatti",31.5310,74.2928,["pakki thatti"]],["Thokar Niaz Baig",31.4710,74.2400,["thokar"]],["Raiwind Road",31.4200,74.2400,["raiwind"]]
].map(([name,lat,lng,aliases])=>({name,lat,lng,aliases:[name.toLowerCase(),...aliases]}));
