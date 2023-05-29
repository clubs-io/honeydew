# Honeydew

This is an Open Source project to allow college organizations to make payments and handle their finances. 

## About this project
This project as an experiment to build a modern app (with features like authentication, payments, API routes) would work in Next.js 13.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://discord.gg/ZURcMR3v) and ask for help.

## Known Issues:
A list of things not working right now:

1. Discord authentication (use email)
2. UTC Time Conversions from Admin to Client Side on Frontend

## Running Locally
1. Install dependencies using yarn:
```sh
yarn
```
2. Copy .env.example to .env.local and update the variables.
```sh
cp .env.example .env
```
3. Start the development server:
```sh
yarn dev
```
