# GraphQL Profile Page Project

This project is designed to help you learn about GraphQL, GraphiQL, hosting, JWT, authentication, authorization, and the basics of human-computer interface (UI/UX) by creating a profile page that displays your own school information.

## Objectives
- Learn the GraphQL query language
- Create a profile page that displays three pieces of information about yourself (e.g. basic user identification, XP amount, grades, audits, skills)
- Include a mandatory section for generating statistic graphs using SVG
- Create a login page that functions with both `username:password` and `email:password` authentication
- Host the profile page on a platform of your choice (e.g. GitHub Pages, Netlify)

## Project Requirements
- Use the GraphQL endpoint provided by the platform to query your own data
- Create a login page that obtains a JWT token using Basic authentication with base64 encoding
- Use the JWT token to access the GraphQL API and retrieve your own data
- Display three pieces of information about yourself on the profile page
- Include a section for generating statistic graphs using SVG
- Use GraphiQL to explore the schema and learn about the available query parameters
- Use all types of querying present in the project (normal, nested, and using arguments)

## Hosting
Host the profile page on a platform of your choice (e.g. GitHub Pages, Netlify)

## GraphQL Tables and Columns
- **user table**: information about the user (id, login, etc.)
- **transaction table**: information about XP and audits (id, type, amount, objectId, userId, etc.)
- **progress table**: information about student progression (id, userId, objectId, grade, etc.)
- **result table**: information about student results (id, objectId, userId, grade, etc.)
- **object table**: information about all objects (exercises/projects) (id, name, type, attrs)

## Examples
- Querying the user table
- Querying the object table
- Learning Outcomes
- Learn about GraphQL and its query language
- Learn about GraphiQL and how to use it to explore the schema
- Learn about hosting and how to host a profile page on a platform of your choice
- Learn about JWT and how to use it for authentication and authorization
- Learn about the basics of human-computer interface (UI/UX) and how to create a user-friendly profile page
