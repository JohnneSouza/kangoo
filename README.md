# Kangoo: An Open Source E-commerce Platform
[![Customers Docker Image CI](https://github.com/JohnneSouza/kangoo/actions/workflows/customers-image.yml/badge.svg)](https://github.com/JohnneSouza/kangoo/actions/workflows/customers-image.yml)

## About Kangoo

Kangoo is an open-source e-commerce platform designed to explore and demonstrate the microservices architectural model and the technologies that support it. Developed using Java and Spring Boot, Kangoo aims to provide a learning platform for developers interested in microservices, containerization, and cloud deployment.

The project is developed in my spare time with the goal of understanding microservices architecture in-depth and mastering the technologies around it.

## Goal

The primary goal of Kangoo is to serve as an educational tool for developers to learn about microservices architecture. It's designed to showcase the end-to-end development and deployment of microservices in a realistic scenario. Through Kangoo, I aim to explore:

- The intricacies of designing and implementing microservices
- Containerization and orchestration with Docker
- Continuous Integration and Continuous Deployment (CI/CD) pipelines
- Cloud deployment strategies

## Technology Stack

Kangoo is built with the following technologies:

- **Spring Boot 3**: For creating microservices
- **Java 17**: As the programming language
- **Docker**: For containerizing the microservices
- **Maven**: For managing project dependencies
- **PostgreSQL**: As the database for persisting data
- **Testcontainers**: For integration testing with Docker containers
- **Git**: For version control

## Features

Kangoo is still under development, and the current focus is on building the core microservices, including:

- **Customers Service**: To manage customer data
- **Products Service**: To manage product listings
- **Orders Service**: For handling customer orders
- **Identity Service**: For authentication and authorization

Future enhancements will include:

- Implementing a robust CI/CD pipeline for automated testing and deployment
- Cloud deployment of the entire platform
- Addition of more microservices for features like payment processing and inventory management

## Contributing

Contributions are warmly welcomed, whether it's in the form of code, bug reports, feature requests, or documentation improvements. As I'm building Kangoo alone in my spare time, any help or insights from the community are greatly appreciated.

To contribute:

1. Fork the repository
2. Create your feature branch 
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes 
```bash
git commit -m "feat - Description of my amazing feature"
```
4. Push to the branch
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

## License

Kangoo is open source and available under the [Apache 2.0](https://raw.githubusercontent.com/JohnneSouza/kangoo/main/LICENSE) license.

## Acknowledgments

- Thanks to all the open source tools and libraries that make this project possible.
- A special thank you to the Spring and Java community for providing extensive resources and support.

---

Happy coding! 🚀
