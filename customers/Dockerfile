FROM azul/zulu-openjdk-alpine:17.0.10-jdk AS build
WORKDIR /project

# Copy only necessary files to retrieve the dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src src
RUN ./mvnw clean package -DskipTests

FROM azul/zulu-openjdk-alpine:17.0.10-jre
RUN apk add dumb-init

# Set up a non-root user and group for running the application
RUN addgroup --system javauser && adduser -S -s /bin/false -G javauser javauser
WORKDIR /app

COPY --from=build /project/target/*.jar application.jar
RUN chown -R javauser:javauser /app
USER javauser

CMD ["dumb-init", "java", "-jar", "application.jar"]