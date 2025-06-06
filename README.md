# **TCSS 460 – Beta II Sprint Front End Project**

## **Hosted Links**
- **Vercel-hosted Web App:** [Vercel](https://group7-tcss460-front-git-4dab59-ayub-mohameds-projects-aeb98294.vercel.app/)
- **Heroku-hosted Web API:** [Heroku](https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/)

## **Team Contributions (Beta II Sprint)**
- **Bhavneet** – Implemented the Book Search page that connects to the 3rd-party Book API using multiple search criteria. Reused the book list component from the last sprint to display search results. Assisted with UI/UX cleanup and helped debug star rating updates.
- **Ayub** – Integrated the book details view with a live star rating update component. Worked on connecting the single book page to the Book API.
- **Andrew** – Developed the Change Password page and integrated it with the 3rd-party Auth API. Focused on form validation and functionality testing.
- **Bernard** – Created the Create Book form page, ensuring all fields required by the API are present. Participated in refining UI consistency across views. Drafted UX mockups for Delete Book (design-only).

## **Sprint Meetings (Beta II Sprint)**
- **Tuesday, May 20 (11:00 AM – 12:30 AM)** – Discord  
  Discussed tasks, confirmed endpoints for Book API integration, divvied up remaining sprint requirements.
  
- **Thursday, May 23 (5:00 PM – 6:30 PM)** – Discord  
  Reviewed progress. Worked together on pairing book search with 3rd-party API responses. Discussed star rating edge cases.
  
- **Saturday, May 24 (2:00 PM – 3:30 PM)** – Discord  
  Live-tested password changes, created dummy accounts, finalized Create Book form inputs and validation.

- **Sunday, May 26 (1:00 PM – 2:00 PM)** – Discord  
  Reviewed current bugs and UI issues, discussed Vercel deployment requirements, and finalized which team members would push what.

- **Tuesday, May 28 (4:30 PM – 6:00 PM)** – Discord  
  Finalized book detail page behavior, tested 3rd-party API endpoints, ensured correct API key behavior.

- **Wednesday, May 29 (12:00 PM – 1:30 PM)** – Discord  
  Reviewed README tasks, validated beta requirements completion, fixed final bugs before merging.

- **Saturday, June 1 (3:00 PM – 4:30 PM)** – Discord  
  Final meeting to verify deployment to Vercel and Heroku. Reviewed README content and ensured it reflects all final work.

_Communication during the sprint was primarily over Discord using voice chat and screen sharing. GitHub Issues and group chat were used to track tasks and fix bugs._

## **Sprint Comments (Beta II Sprint)**
- All Beta II requirements are integrated and pushed to the Production (main) branch as requested.
- The **Change Password** view uses live connection to the Auth API and includes form validation and success/error alerts.
- The **Book Search** view allows users to search by title, author, subject, etc. and pulls **live data** from the 3rd-party Book API.
- The **Book List** page is reused for displaying search results and general book browsing.
- The **Single Book View** shows details of a selected book and includes an interactive star rating update component.
- The **Create Book** form includes all fields needed by the backend API. This does not connect to the Book API (optional).
- The **Delete Book** functionality is **designed** but not implemented (design-only requirement).
- Known issue: altering the LIVE DB in development (via star rating or book creation) is acknowledged as a poor practice, per instructor’s note.
- For testing login:  
  **Username:** `test@example.com`  
  **Password:** `Test123!@`  


# **TCSS 460 – Alpha Sprint Front End Project**

## **Hosted Links**
- **Vercel-hosted Web App:** [Vercel](https://group7-tcss460-front-end.vercel.app/)
- **Heroku-hosted Web API:** [Heroku](https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/)

## **Team Contributions**
- **Bhavneet** – Fixed bugs so group 1 can use our API.
  - Fixed user routes and removed duplicate entries in the csv file.
- **Ayub** – Setup and deployed project to vercel.
- **Andrew**  – Fixed bugs so group 1 can use our API.
  - Populated the data in the csv within our database.
  - Fixed the book routes.
- **Bernard** – Organized and ran meetings.

## **Sprint Meetings**
- **Monday, May 13 (11:00 AM – 12:30 AM)** – Discord  
- **Wednesday, May 15 (5:00 PM – 6:30 PM)** – Discord  
- **Friday, May 18 (2:00 PM – 3:30 PM)** – Discord  

_The team used Discord voice chat for real-time communication and discussion during this sprint as well as ability to pair program._

## **Sprint Comments**
- Successfully setup and deployed project to vercel.
- Fixed bugs and routes.
