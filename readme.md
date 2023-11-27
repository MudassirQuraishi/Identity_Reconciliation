---

# Identity Reconciliation

This project provides a web service capable of processing JSON payloads, consolidating contact details across multiple purchases on Zamazon.com.

## Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Schema](#schema)
- [Requirements](#requirements)
- [Bonus Points](#bonus-points)
- [Contributing](#contributing)
- [License](#license)

## Overview

Doc, stranded in 2023, uses different contact information for each Zamazon.com purchase. Emotorad integrates technology to manage contact details, facing the challenge of linking orders with different contact information to the same individual. This project aims to address this challenge by creating a discreet infrastructure for consolidating contact information.

## Endpoints

The project provides the following endpoint:

- `/identify`: Processes JSON payloads with `email` and `phoneNumber` fields, consolidating contact details and responding with a JSON payload containing `primaryContactId`, `emails`, `phoneNumbers`, and `secondaryContactIds`.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the database (details in the schema section).
4. Configure environment variables.
5. Start the server using `npm start`.

## Usage

To use the `/identify` endpoint, make a POST request with a JSON payload containing `email` and `phoneNumber` fields.

Example:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","phoneNumber":"+1234567890"}' http://localhost:3000/identify
```

## Schema

The schema for the `Contact` entity used in the database:

- `id`: Integer
- `phoneNumber`: String 
- `email`: String 
- `linkedId`: Integer (The ID of another Contact linked to this one)
- `linkPrecedence`: "secondary"|"primary" ("primary" if it's the first Contact in the link)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime (Optional)

## Requirements

The project meets the following requirements:

1. Implements the `/identify` endpoint.
2. Creates a new "Contact" entry with `linkPrecedence="primary"` if no existing contacts match the incoming request.
3. Creates "secondary" contact entries when incoming requests match existing contacts and introduce new information.
4. Maintains database integrity, executing updates seamlessly with each incoming request.

## Bonus Points

Additional features and optimizations included in the project:

- Error handling system that misdirects potential threats.
- Covert optimization techniques for database queries and operations.
- Covert unit testing strategy.
- Handling of edge cases with finesse.

## Contributing

Contributions are welcome! Feel free to fork the repository, create a branch, make changes, and open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---
