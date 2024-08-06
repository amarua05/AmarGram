# AmarGram - Social Media Web Application

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

AmarGram is a social media web application built with modern web technologies, offering users a platform to connect, share content, and interact with each other. With a clean and responsive design, AmarGram provides a seamless user experience across devices. This project leverages React and TypeScript for the frontend, and AppwriteDB for backend services, ensuring a robust and scalable application.

## Features

- **User Authentication**: Secure sign-up, login, and logout functionalities.
- **Profile Management**: Users can create and manage their profiles with ease.
- **Post Creation**: Create, edit, and delete posts with a simple and intuitive interface.
- **User Interactions**: Like, save and comment on posts, with real-time updates to keep the experience dynamic.
- **Responsive Design**: Optimized for use on various devices, ensuring accessibility for all users.
- **Search and Filtering**: Efficiently search for users and filter posts to find relevant content.

## Tech Stack

- **Frontend**:
  - React: For building dynamic and responsive user interfaces.
  - TypeScript: Providing type safety and improving code quality.
  - Vite: For fast and efficient development and build processes.
  - Tailwind CSS: Used for styling and designing UI components.

- **Backend**:
  - Appwrite DB: Manages user data, authentication, and real-time database features.

- **Tools & Libraries**:
  - React Query: For managing server state and caching.
  - React Router: Facilitates navigation within the application.
  - ESLint: For maintaining code quality and consistency.


## Configuration

To customize the configuration of AmarGram, modify the environment variables in the `.env.local` file:

```plaintext
VITE_APPWRITE_URL = 'https://cloud.appwrite.io/v1'

VITE_APPWRITE_PROJECT_ID = '######'


VITE_APPWRITE_DATABASE_ID = '######'
VITE_APPWRITE_STORAGE_ID = '######'


VITE_APPWRITE_SAVES_COLLECTION_ID = '######'
VITE_APPWRITE_USER_COLLECTION_ID = '######'
VITE_APPWRITE_POST_COLLECTION_ID = '######'
```

Adjust these values according to your setup.

## Usage

AmarGram is hosted and available for use [Here](https://social.amaremini.com). Explore the app, create an account, and start connecting with others.

## Contributing

Contributions are welcome! If you'd like to contribute to AmarGram, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out to me at [hello@amaremini.com](mailto:hello@amaremini.com).

---

Enjoy using AmarGram, and feel free to contribute to its growth and improvement!
