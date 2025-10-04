// This file will create an interface to define the data for a single Trip that will be received from the API endpoint as a JSON object

/* 
Instances of this interface will be used to transfer HTML form data to the component for rendering 
as well as between components and the REST endpoint.
Angular will automatically marshal the data back and forth between JSON and JavaScript objects.
*/

export interface Trip {
    _id: string,
    code: String,
    name: String,
    length: String,
    start: Date,
    resort: String,
    perPerson: String,
    image: String,
    description: String
}