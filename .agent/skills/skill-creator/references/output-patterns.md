# Output Patterns

When designing skills, follow these output patterns for consistency and quality:

## Structure
- Always return JSON for tool outputs.
- Include a `status` field (`success`, `error`, `incomplete`).
- Use descriptive keys.

## Error Handling
- Capture exceptions and return them in the `error` field.
- Provide actionable feedback in the `message` field.
