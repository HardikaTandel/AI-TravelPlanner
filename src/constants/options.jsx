export const SelectTravelList=[
    {
        id:1,
        title:'Just Me',
        desc: 'A soul travels in exploration',
        icon:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc: 'Two travels in tandem',
        icon:'💑',
        people:'2'
    },
    {
        id:3,
        title:'Family',
        desc: 'A group of fun loving adv',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc: 'A bunch of thrill-seekers',
        icon:'🥂',
        people:'5 to 10 People'
    },
]

export const SelectBudgetOptions=[
{
    id:1,
    title:'Cheap',
    desc:'Stay conscious of costs',
    icon:'💸'
},
{
    id:2,
    title:'Moderate',
    desc:'Keep costs on average side',
    icon:'💰'
},
{
    id:3,
    title:'Luxury',
    desc:'Dont worry about the cost',
    icon:'🤑'
},
]
 
export const AI_PROMPT ='Generate travel plan for location: {location}, for {totalDays} days for {traveler} with a {budget} budget , Give me hotels options list with HotelName, Hotel address, Price , hotel image url, geo coordinates, ratings , descriptions and suggest itinerary with placeName ,  approximate 15 words Place details, place image urls , Geo cordinates , ticket pricing , specific time to travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format'