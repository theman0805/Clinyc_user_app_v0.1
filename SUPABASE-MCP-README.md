# Supabase MCP Server for Clinyc

This guide explains how to use the Supabase MCP (Model Context Protocol) server with your Clinyc application. The MCP server allows you to interact with your Supabase database through the AI assistant.

## Setup

The Supabase MCP server has been configured for your Clinyc application. The setup includes:

1. An MCP configuration file (`.cursor/mcp.json`) that points to the Supabase MCP server
2. A Supabase configuration file (`supabase-mcp-config.json`) that contains your Supabase credentials

## How It Works

The Supabase MCP server provides a `query` tool that allows the AI assistant to perform operations on your Supabase database. These operations include:

- Selecting data from tables
- Inserting new records
- Updating existing records
- Deleting records
- Executing custom SQL queries
- Joining tables
- Filtering, ordering, and paginating results

## Using the MCP Query Tool

To use the MCP Query tool, simply ask the AI assistant to perform operations on your Supabase database. For example:

- "Fetch all user profiles from my Supabase database"
- "Add a new case for user X with title 'Medical Consultation'"
- "Find all documents related to case Y"
- "Update the status of case Z to 'closed'"
- "Find all messages between users A and B"

The AI assistant will use the appropriate MCP Query tool to perform the requested operation.

## Example Files

Two example files have been created to help you understand how to use the Supabase MCP server:

1. `mcp-supabase-example.js`: Contains examples of different MCP Query operations you can perform
2. `scripts/test-mcp-supabase.js`: A test script with example prompts you can use with the AI assistant

## Available Tables

Based on your Supabase schema, you can interact with the following tables:

- `profiles`: User profile information
- `cases`: Medical cases
- `documents`: Documents associated with cases
- `messages`: Messages between users
- `sharing_log`: Log of case sharing activities

## Query Operations

The MCP Query tool supports the following operations:

### Select

```json
{
  "operation": "select",
  "table": "profiles",
  "columns": "*",
  "filters": { "id": "user-id-here" }
}
```

### Insert

```json
{
  "operation": "insert",
  "table": "profiles",
  "data": {
    "id": "user-id-here",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Update

```json
{
  "operation": "update",
  "table": "profiles",
  "data": {
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "filters": { "id": "user-id-here" }
}
```

### Delete

```json
{
  "operation": "delete",
  "table": "profiles",
  "filters": { "id": "user-id-here" }
}
```

### SQL

```json
{
  "operation": "sql",
  "sql": "SELECT * FROM profiles WHERE first_name ILIKE '%John%'"
}
```

## Advanced Query Features

### Joins

```json
{
  "operation": "select",
  "table": "cases",
  "columns": "cases.*, profiles.first_name, profiles.last_name",
  "joins": [
    {
      "table": "profiles",
      "on": { "cases.user_id": "profiles.id" }
    }
  ],
  "filters": { "cases.status": "active" }
}
```

### Ordering and Pagination

```json
{
  "operation": "select",
  "table": "documents",
  "columns": "*",
  "filters": { "case_id": "case-id-here" },
  "order": { "created_at": "desc" },
  "limit": 10,
  "offset": 0
}
```

## Security Considerations

The Supabase MCP server uses your Supabase credentials to connect to your database. The server respects the security rules defined in your Supabase project, so operations are limited by the permissions of the API key being used.

For production use, consider:

1. Using row-level security (RLS) policies in Supabase to restrict access to data
2. Using the anonymous key for operations that should be available to all users
3. Using the service key only for operations that require elevated privileges

## Troubleshooting

If you encounter issues with the Supabase MCP server:

1. Check that the `.cursor/mcp.json` file points to the correct Supabase MCP server URL
2. Verify that the `supabase-mcp-config.json` file contains the correct Supabase credentials
3. Ensure that your Supabase project is running and accessible
4. Check the Supabase console for any errors or issues with your database

## Next Steps

Now that you have the Supabase MCP server set up, you can:

1. Explore the example files to understand the different operations you can perform
2. Ask the AI assistant to help you query data from your Supabase database
3. Integrate MCP queries into your application workflow
