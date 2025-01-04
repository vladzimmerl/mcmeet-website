# McMeet - A Meeting Organization Web Application 

Link: https://mcmeet.vladzimmerl.com

## Authors: Emry Mcgill, Vlad Zimmerl, Mykyta Bychkov

## Description: 
McMeet is a web application that lets members create one-time or recurring meetings, that other members, or non-members can register to attend.

## Features:

### Create Booking: 
When a member creates a booking they choose if it's a one-time meeting or if it's recurring. If its recurring they can choose the date range, and how often it recures. This creates many meeting objects in which other users can register to attend.

### Dashboard: 
On the dashboard members can view all the meetings that they are registered for.

### Deleting a meeting:
If you are the organizer of a meeting, you can choose to delete it.

### Withdrawing from a meeting:
If you are registered to attend a meeting, you can withdraw and take your name off the list of participants.

### Request Special Meeting:
If you wish to request a one-time meeting with someone in specific then you can send them a request with 3 date/time options, in which they can either accept an option or they can send an alternative request.


## Frontend code: Emry McGill 261048667

Files worked on: everything in frontend directory

Page Routing:
- This is a SPA, so the pages are components that get swapped out using react-router
- The page components are located in the pages directory.

Protected Pages:
- Any page wrapped in the Protected component is protected.
- The protected component checks if there is a user token in local storage and redirects to the login page if not.

API calls:
- The frontend call the backend API using the AXIOS library.
- All API calls are made in try/catch blocks in order to prevent crashes.
- Some API calls are protected from unauthorized users. The user token is sent in the API request and gets validated on the backend.

Input Validation:
- Form inputs are validated on the frontend in order to prevent excess server usage.

Components:
- Custom reusable components are located in the components directory 

The frontend runs on port 3000

## Backend code: Vlad Zimmerl 261113967

Files worked on: server.js, backend.js

backend.js:
Small utility functions for server.js
E.g. generating url, hashing passwords, validating emails

server.js:
Main file with server api calls and their functionality

We use the express js framework to create the api routes

Api calls split over 3 main sections:
- Authentication
- Meetings
- Requests

Security considerations:
- jwt tokens assigned at login and used for sessions
- authenticated calls use a middleware function which checks the jwt
- passwords are hashed
- incoming requests are checked to a reasonable extent
- api calls are wrapped in a try/catch function preventing the server from crashing
- erros and abnormalities are logged to the console

API endpoints:

\* indicates authenticated privated endpoints

** indicates secret access from random generated url

1. Authentication \
POST /api/auth/register \
POST /api/auth/login \
*GET /api/email

Summary:
create and access accounts, get email of a logged in user

2. Meetings \
*POST /api/createBooking \
*GET /api/getMeetings \
**GET /api/getMeetingsById/:id \
POST /api/bookMeeting \
*POST /api/removeMeeting

Summary:
create meetings, register for meetings, get past and upcoming meetings, delete meetings

3. Requests \
*POST /api/createRequest \
*GET /api/getRequests\ 
*POST /api/acceptRequest \
*POST /api/deleteRequest

Summary:
create requests, see requests, accept a request, delete a request when sending alternative


The backend server runs on port 5000

## Database code: Mykyta Bychkov 261047436

Files worked on: operations.js prior to code change

We use mongodb as the database program, and the mongoose library to communicate with inputs
Mongoose uses Schemas to model the data sent to the database. The following Schemas were defined: Members, Meetings, Bookings, Requests.

The following function were defined to interface with the backend:
Login functions: \
register(email, password) \
accountExists(email) \
login(userId, password) 

Dashboard functions: \
getAllMeetingsAndBookings(userId) 

Create functions: \
createBooking(email, meetingId) \
meetingExists(meetingId) \
addParticipant(meetingId) 

Request functions: \
createRequest(title, user, withWho, option1, option2, option3) \
getallRequests(user) \
alternativeRequest(oldReqId, title, user, withWho, option1, option2, option3) 

Remove functions: \
removeBooking(bookingId) \
userOwnsBooking(userId, bookingId) \
removeMeetingAndRelatedBookings(meetingId) \
userOwnsMeetingAndRecurring(userId, meetingId) \
createMeeting(userId, title, dateRange, timeRange, recurring, capacity) \
addURL(masterId, url) \
validURL(url) \
getMeetings(url)
