# 🛍️ ZMART — Microservices E-Commerce Platform

> A cloud-native, event-driven e-commerce platform built with **FastAPI**, **Node.js (TypeScript)**, **Kafka**, **Elasticsearch**, and **React** — orchestrated using **Docker Compose**.

---

## 🚀 Overview

This project demonstrates a **microservices-based e-commerce system**, featuring authentication, product catalog, cart & checkout, and AI-powered recommendations.

Each service is independently deployable, communicates via HTTP and Kafka events, and is exposed through a single **API Gateway** endpoint.

---

## 🧩 Microservices Overview

| Service                       | Tech Stack                               | Description                                                                                            |
| ----------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 🧭 **API Gateway**            | Express.js (TypeScript)                  | Unified entry point for frontend and clients. Handles routing, JWT verification, and request proxying. |
| 👤 **Auth Service**           | FastAPI + SQLAlchemy + JWT               | Manages user registration, login, and JWT authentication.                                              |
| 🛍️ **Catalog Service**        | Node.js + Express + TypeORM + PostgreSQL | Hosts the product catalog: listing, filtering, and searching.                                          |
| 🛒 **Cart & Order Service**   | Node.js + Express + TypeORM + Kafka      | Manages shopping cart, checkout, and order creation. Publishes `order.completed` events to Kafka.      |
| 💡 **Recommendation Service** | FastAPI + aiokafka + PostgreSQL          | Listens to Kafka `order.completed` events and generates “bought together” product recommendations.     |
| 🔍 **Elasticsearch**          | Elastic Stack                            | Provides full-text product search and analytics.                                                       |
| 📊 **Kibana**                 | Elastic UI                               | Visualization dashboard for Elasticsearch data.                                                        |
| 🗄️ **PostgreSQL**             | Postgres 15                              | Shared database for all transactional services.                                                        |
| 🦜 **Kafka + Zookeeper**      | Confluent Stack                          | Message broker enabling async event streaming between services.                                        |
| 💻 **Frontend**               | React + TypeScript                       | SPA consuming the unified API Gateway.                                                                 |

---

## 🧠 System Architecture

```mermaid
flowchart TD
    A[Frontend (React)] --> B[API Gateway (Express + TS)]
    B --> C[Auth Service (FastAPI)]
    B --> D[Catalog Service (Node + PG)]
    B --> E[Cart & Order Service (Node + Kafka)]
    E -->|order.completed| F[Recommendation Service (FastAPI + Kafka)]
    F --> G[PostgreSQL]
    D --> G
    C --> G
    E --> G
    G --> H[Elasticsearch]
    H --> I[Kibana]
```
