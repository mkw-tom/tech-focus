# Contract Checklist

- Is this shape shared across app boundaries?
- Does runtime validation belong at the boundary?
- Should this field be an enum instead of a string?
- Does the frontend parse the same payload the backend returns?
- Can an existing schema be extended instead of creating a near-duplicate?
- Are inferred types exported alongside the schema?
