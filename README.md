# CarpoolBoard — Prototype 5

## Project Overview

CarpoolBoard is a mobile carpooling application designed to help college students connect with drivers and riders for shared transportation.

The application allows users to explore rides, manage their profiles, and switch between Driver and Rider modes.

This project is developed for the Mobile App Development course at Southern Methodist University.

## Technologies Used

- React Native
- Expo
- JavaScript
- Supabase (Database and Storage)
- Expo Application Services (EAS)
- Git and GitHub

## Prototype 5 Features

### User Accounts
- Create or access an account using an email address.
- Select Driver or Rider mode.
- Switch between Driver and Rider modes using the same account.

### User Profiles
- Edit profile information, including name and bio.
- Add vehicle information.
- Upload profile pictures using Supabase Storage.
- Save profile changes to the database.

### Driver and Rider Experience
- Separate interfaces and actions for Drivers and Riders.
- View ride information.
- Explore ride-management features.

### User Interface
- Updated Home and Profile screens.
- Improved navigation and visual design.
- Profile pictures displayed throughout the application.

## Improvements From Prototype 4

Prototype 5 introduces several improvements over the previous version:

1. Editable user profiles.
2. Profile picture uploads and persistent storage.
3. Driver/Rider mode switching without creating another account.
4. Updated user interface and navigation.
5. Expanded Supabase integration.

## Bug Documentation

Three issues are documented in `bugs.md`:

1. Returning users were locked into their original Driver/Rider role.
2. Uppercase letters in email addresses caused Supabase errors.
3. Ride seat counts could conflict with confirmed passengers.

Each entry includes the symptom, evidence, and fix.


## User Testing

Prototype 5 is being tested through Expo, with an Android preview APK prepared for user testing.

Scan the QR Code or click the expo link.
https://expo.dev/preview/update?message=Fixed+Supabase+configuration+for+User++Prototype+5&updateRuntimeVersion=1.0.0&createdAt=2026-10-08T20%3A34%3A17.903Z&slug=exp&projectId=0e5d81b8-c9ef-4e3a-873f-83c78eb6d72c&group=5b91adbb-8be6-4113-89d4-b05dc82ecceb

<img width="402" height="402" alt="image" src="https://github.com/user-attachments/assets/02395276-50c0-46c1-91ba-38162bc43b98" />



For Android users scan the QR Code or click the link.
https://expo.dev/accounts/smu-c3-mobile-fall-26/projects/CarpoolBoard/builds/cdcf4c22-8842-4e47-8339-7c3261391883

<img width="516" height="516" alt="image" src="https://github.com/user-attachments/assets/63670112-9de6-437e-a7c5-26b8d6139d41" />


Testing focuses on:

- Account access
- Profile editing
- Profile picture uploads
- Driver/Rider mode switching
- Navigation and usability
- Persistence of user information

## Current Limitations

- Some features remain under development.
- Supabase authentication and database security policies require additional improvements before production deployment.
- Further testing is needed across Android and iOS devices.

## Future Improvements

- Improve ride searching and filtering.
- Expand ride request and management features.
- Improve security and authentication.
- Incorporate feedback from user testing.
- Refine the user interface.
- New Map integration.
