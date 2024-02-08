[Movie Catalog Web Application 🎬](https://mymoviecatalog.vercel.app/)
---------------------------------------------------------------------------------------------

I developed a movie catalog website using mainly Next.js and TypeScript, where users can easily browse, rate, create, and manage movies. Below, I outline the functionalities that have been implemented, including administration features:

Homepage: 🏠
The homepage displays a list of movies, with lazy loading implemented for efficient loading.
Users can easily search for movies using the search bar.

Movie Details Page: 🎥
Users can click on a movie to access detailed information, including images, description, release date, associated ratings, etc.

Movie Data: ℹ️
Each movie includes the following data: title, poster, images, release date, ratings, and description.

User Accounts: 👥
Users have the option to log in or register, and their credentials are encrypted in the database.
After logging in, they can add ratings to various movies or create and modify movies if they have the Editor role granted by an Admin.

Admin Panel: 🛠️
Administrators have access to an administrative interface where they can easily view the list of users and modify their roles, such as granting or revoking Viewer/Editor/Admin privileges.

User Roles: 🎭
Viewer: Can add ratings to movies.
Editor: Can create and modify movies.
Admin: Can manage users, including modifying their roles.

Movie Categories: 📽️
Each movie belongs to a category, and movies on the homepage are listed according to these categories.

Most Popular Movies: 🌟
A section on the homepage displays the most popular movies of the past week based on reviews and ratings.

Analytics Panel: 📊
Provides statistics on the popularity of movies and categories.
All data can be exported in PDF format.

Film Slideshow: 🖼️
Movies contain multiple images, which are displayed in a slideshow format alongside the poster.

Technical Implementation: 🛠️
The project was implemented using Next.js, with TypeScript utilized wherever possible. The data is stored in a PostgreSQL database.
