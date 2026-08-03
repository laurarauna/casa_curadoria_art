# Casa Curadoria | Front-End & Media Kit Interface

## Overview

This repository hosts the front-end application and media kit for Casa Curadoria. Built with a focus on refined aesthetic curation and high-performance web standards, the interface acts as the presentation layer for the broader Casa Curadoria ecosystem. 

Designed from a product and growth perspective, the application bridges brand storytelling with live performance metrics, serving as a dynamic media kit for potential B2B partners and sponsors.

## Live Demo

* **Production URL:** [https://www.casacuradoria.art](https://www.casacuradoria.art)
* **Alternative URL:** [https://casa-curadoria-art.vercel.app](https://casa-curadoria-art.vercel.app)

*You can access the live environment directly in your browser to inspect the automated data hydration, dynamic micro-animations, and live performance metrics in real-time.*

## Ecosystem Integration & Data Pipeline

This application operates in a decoupled architecture and relies on an external extraction engine to remain continuously updated without manual intervention:

* **Data Extraction Microservice:** The raw performance metrics, audience demographics, and engagement data are ingested, processed, and structured by the companion repository **[automacao_dados_instagram](https://github.com/laurarauna/automacao_dados_instagram)**.
* **Pipeline Mechanism:** Operating via scheduled Python scripts and GitHub Actions, the extraction pipeline authenticates with the Meta Graph API, writes historical records to a centralized data warehouse (Google Sheets), and compiles a clean `.json` payload (`dados_midia_kit.json`).
* **GitOps Synchronization:** The automation repository automatically pushes the compiled JSON payload directly to the root of this front-end repository, triggering a secure, seamless continuous deployment cycle.

## Value Proposition & Architecture

1. **Automated Data Hydration:** Instead of relying on manual updates or exposing database credentials to the client, the front-end application dynamically consumes the structured JSON payload at runtime.
2. **B2B Credibility:** Displays real-time, verified audience analytics directly sourced from the upstream API pipeline, ensuring complete transparency for commercial partners.
3. **Performance and Security:** Built as a high-performance static web application hosted on Vercel, guaranteeing lightning-fast load times, zero server-side vulnerabilities, and zero infrastructure overhead.

## Technical Implementation

To maintain clean code principles and high maintainability, the application strictly separates structure from logic:

* **UI Structure (`index.html`):** Houses the layout, typography, Tailwind CSS configuration, and micro-animations (such as the film-grain effect and parallax scrolling).
* **Data Integration Engine (`scripts/integracao_dados.js`):** A dedicated JavaScript module responsible for fetching the latest JSON payload, sanitizing and parsing complex string metrics (via regular expressions), and handling dynamic DOM injection.
* **Client-Side Hydration & Fallbacks:** Designed with resilient fallback values to ensure structural integrity and graceful degradation if network requests fail before initializing entrance animations and numerical counters.

## Key Dynamic Components

The interface dynamically renders and animates the following data points:
* **Audience Metrics:** Total follower count, 30-day follower velocity, and monthly impressions.
* **Engagement Indicators:** Overall engagement rate, average post reach, saves, and shares per post.
* **Demographic Breakdown:** Dynamically parses age distribution strings into animated progress bars.
* **Geolocation Data:** Extracts and formats top cities into responsive visual layout pills.

## Technology Stack

* **Markup & Styling:** HTML5, Tailwind CSS (utility-first styling and custom design system)
* **Scripting:** Vanilla JavaScript (ES6+, Asynchronous Fetch API, DOM manipulation, Regex parsing, Intersection Observer API)
* **Deployment & CI/CD:** Vercel (Static Site Generation / GitOps workflow)

## Execution & Deployment Workflow

The application follows a continuous deployment lifecycle:
1. The upstream pipeline (`automacao_dados_instagram`) updates and pushes the `.json` file to this repository.
2. The commit automatically triggers a build hook on Vercel.
3. The front-end compiles and deploys globally with the latest audience metrics in under a minute.
