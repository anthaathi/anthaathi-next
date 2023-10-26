plugins {
	kotlin("jvm") version "1.9.10"
	kotlin("plugin.allopen") version "1.9.10"
	id("io.quarkus")
}

repositories {
	mavenCentral()
	mavenLocal()
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project

dependencies {
	implementation("io.quarkus:quarkus-rest-client-reactive")
	implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))
	implementation("io.quarkus:quarkus-hibernate-reactive")
	implementation("io.quarkus:quarkus-hibernate-reactive-panache")
	implementation("io.quarkus:quarkus-container-image-docker")
	implementation("io.quarkus:quarkus-smallrye-fault-tolerance")
	implementation("io.quarkus:quarkus-smallrye-health")
	implementation("io.quarkus:quarkus-kubernetes")
	implementation("io.quarkus:quarkus-micrometer")
	implementation("io.quarkus:quarkus-grpc")
	implementation("io.quarkus:quarkus-narayana-jta")
	implementation("io.quarkus:quarkus-hibernate-validator")
	implementation("io.quarkus:quarkus-kotlin")
	implementation("io.quarkus:quarkus-opentelemetry")
	implementation("io.quarkus:quarkus-hibernate-reactive-panache-kotlin")
	implementation("io.quarkus:quarkus-reactive-pg-client")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("io.quarkus:quarkus-arc")
	implementation("io.quarkus:quarkus-resteasy-reactive-jackson")
	implementation("io.quarkus:quarkus-rest-client-reactive-jackson")

	// Temporal
	implementation("io.temporal:temporal-sdk:1.22.2")

	// Mailer
	implementation("io.quarkus:quarkus-mailer")

	testImplementation("io.quarkus:quarkus-junit5")
}

group = "co.anthaathi"
version = "1.0.0-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
	targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<Test> {
	systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
	kotlinOptions {
		freeCompilerArgs += "-Xjvm-default=all"
	}
}

allOpen {
	annotation("jakarta.ws.rs.Path")
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.enterprise.context.ApplicationScoped")
	annotation("io.quarkus.test.junit.QuarkusTest")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
	kotlinOptions.jvmTarget = JavaVersion.VERSION_17.toString()
	kotlinOptions.javaParameters = true
}
