
type CategoryField = {
    field: string;
    field_description: string;
}

type EmailCategory = {
    category: string;
    output: CategoryField[]
}

type CategorizeEmailObject = {
    email: string;
    categories: EmailCategory[]
}

const testObj: CategorizeEmailObject = {
    "email": "Hello, I am running late and I cannot be there on time for my 1:30 reservation. Would it be possible to reschedule it for 2:30. Also we have one person who cannot make it, so we will only need a table for 5 now. Thank you, - Jane Doe",
    "categories": [
        {
            "category":"Updating Reservation. This is a category for emails about changing a reservation time. Clients will write in letting us know they need to change the time or number of people for their reservation, or simply cancel the reservation",
            "output": [
                {
                    "field": "client_name",
                    "field_description": "The name of the person emailing about the reservation"
                },
                {
                    "field": "change_time",
                    "field_description": "The time that the client wants to change their reservation to"
                },
                {
                    "field": "change_count",
                    "field_description": "The new amount of people the client wants to accomodate for the reservation"
                }
            ]
        },
        {
            "category": "Update Membership. This is a category for emails about clients modifying their Wine Members Club membership. Clients with an active membership may want to update how many bottles per month they recieve",
            "output": [
                {
                    "field": "bottles_per_month",
                    "field_description": "The amount of bottles per month a client would like to recieve"
                },
                {
                    "field": "client_name", 
                    "field_description": "The name of the client"
                }
            ]
        }
    ]
}