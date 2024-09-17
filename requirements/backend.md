# Feature requirement
- create type interface for all api calls including request, response type
- all apis must be under /api/*
- must generate test case for api
- base url for all api is https://pb.talentcrew.tekishub.com/api/collections/*/records example for Candidate url should be https://pb.talentcrew.tekishub.com/api/collections/Candidate/records
- generate docs for all api calls and save it in documents/*.md

# API docs
- Candidate
  - GET
    - **Endpoint:** `/api/collections/Candidate/records`
    - **Description:** Retrieve a list of candidates.
    - **Query Parameters:**
      - `page`: Number - The page (offset) of the paginated list (default to 1).
      - `perPage`: Number - Specify the max returned records per page (default to 30).
      - `sort`: String - Specify the records order attribute(s). Use `-` for DESC and `+` or no prefix for ASC.
      - `filter`: String - Filter the returned records. Example: `?filter=(id='abc' && created>'2022-01-01')`
      - `expand`: String - Auto expand record relations. Example: `?expand=relField1,relField2.subRelField`
      - `fields`: String - Comma separated fields to return. Example: `?fields=*,expand.relField.name`
      - `:excerpt(maxLength, withEllipsis?)`: Modifier to return a short version of a field.
      - `skipTotal`: Boolean - If set, skips total counts query.
    - **Responses:** JSON object containing pagination info and list of candidate items.

  - POST
    - **Endpoint:** `/api/collections/Candidate/records`
    - **Description:** Create a new candidate.
    - **Body Parameters:**
      - All fields as defined in the Candidate interface. Fields like `resume` should be uploaded as files.
    - **Query Parameters:**
      - `expand`: String - Auto expand relations when returning the created record.
      - `fields`: String - Comma separated fields to return.
    - **Responses:** JSON object of the created candidate.

  - PATCH
    - **Endpoint:** `/api/collections/Candidate/records/:id`
    - **Description:** Update an existing candidate by ID.
    - **Path Parameters:**
      - `id`: String - ID of the candidate to update.
    - **Body Parameters:**
      - Partial fields as defined in the Candidate interface.
    - **Query Parameters:**
      - `expand`: String - Auto expand relations when returning the updated record.
      - `fields`: String - Comma separated fields to return.
    - **Responses:** JSON object of the updated candidate.